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
        console.log("docs: ", docs);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 0,
            separators: ["\n\n", "\n", " ", ""],
        })
        console.log("\n\nbefore splitting");
        console.log("\n\nsplitter: ", splitter);

        const splitDocs = await splitter.splitDocuments(docs);

        console.log("\n\nafter splitting");
        console.log(splitDocs);

        const embeddings = new OllamaEmbeddings({
            baseUrl: "http://localhost:11434",
            model: 'embeddinggemma'
        })
        console.log("embeddings", embeddings);

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });
        console.log("vectorStore: ", vectorStore);
        await vectorStore.addDocuments(splitDocs);
        console.log("\n\nAll the docs are uploaded to the qdrant");
    },
    {
        connection: {
            host: "localhost",
            port: "6379",
        }
    }
)
