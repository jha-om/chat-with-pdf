import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama"

const worker = new Worker(
    'file-upload-queue',
    async (job) => {
        const data = JSON.parse(job.data);
        const loader = new PDFLoader(data.path);
        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 0,
            separators: ["\n\n", "\n", " ", ""],
        })

        const splitDocs = await splitter.splitDocuments(docs);


        const embeddings = new OllamaEmbeddings({
            baseUrl: "http://localhost:11434",
            model: 'embeddinggemma'
        })

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });
        await vectorStore.addDocuments(splitDocs);
    },
    {
        connection: {
            host: "localhost",
            port: "6379",
        }
    }
)
