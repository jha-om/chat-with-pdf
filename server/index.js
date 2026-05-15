import express from "express";
import multer from "multer";
import cors from "cors";
import { Queue } from "bullmq"
import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai"

const app = express();
const PORT = 8000;
const queue = new Queue('file-upload-queue', {
    connection: {
        host: "localhost",
        port: "6379"
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage })

const client = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama"
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: "hello from backend"
    })
});

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
    await queue.add('upload-job', JSON.stringify({
        file: req.file.originalname,
        path: req.file.path,
        destination: req.file.destination,
    }));

    return res.status(200).json({
        message: "file uploaded",
    })
});

app.get('/chat', async (req, res) => {
    const query = req.query.message;

    const embeddings = new OllamaEmbeddings({
        baseUrl: "http://localhost:11434",
        model: 'embeddinggemma'
    })

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
    });

    const retreiver = vectorStore.asRetriever({
        k: 2,
    });
    const result = await retreiver.invoke(query);
    const prompt = `You are a helpful assistant that answers questions using only the provided context from documents.
            If the answer is not found in the context, clearly say: “I don’t know based on the provided documents.”

            Use the context as the primary source of truth. Be accurate, concise, and do not make up information.
            If relevant, combine multiple parts of the context to form a complete answer.
            Always prioritize correctness over completeness, but make sure the answer to be complete.

            Also give clean output, don't use any sort of latex in the response. Just a clean, proper and enriched response.

            If there are multiple questions asked then answer it in the separate paragraph but maintaining the flow of the answer so that it doesn't differ between those questions
            
            Context: ${JSON.stringify(result)}
        `;
    const chat = await client.chat.completions.create({
        model: 'gemma4:31b-cloud',
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: query,
            }
        ]
    })

    return res.json({
        message: chat.choices[0].message.content,
        docs: result
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
})