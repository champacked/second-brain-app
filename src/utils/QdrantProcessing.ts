// QdrantProcessing.ts
import { QdrantClient } from "@qdrant/js-client-rest";
import { ContentType } from "../types/Schemas";
import { cleanPayload } from "./cleanPayload";
import { getEmbeddings } from "./TextEmbeddings";

const COLLECTION_NAME = "big-brain";
const VECTOR_SIZE = 1024; // Adjust based on your embeddings model

const client = new QdrantClient({
  url: process.env.QDRANT_HOST,
  apiKey: process.env.QDRANT_API,
  checkCompatibility: false,
});

const ensureCollectionExists = async () => {
  try {
    const collections = await client.getCollections();
    const collectionNames = collections.collections.map((c) => c.name);

    if (!collectionNames.includes(COLLECTION_NAME)) {
      console.log(
        `Collection '${COLLECTION_NAME}' does not exist. Creating...`
      );
      await client.createCollection(COLLECTION_NAME, {
        vectors: { size: VECTOR_SIZE, distance: "Cosine" },
      });
      console.log(`Collection '${COLLECTION_NAME}' created.`);
    }
  } catch (error) {
    console.error("Error ensuring collection exists:", error);
  }
};

export const QdrantUpsertPoints = async (data: ContentType) => {
  await ensureCollectionExists();
  console.log("server reached here");
  const payload = cleanPayload(data);
  const embeddings = await getEmbeddings(payload);
  try {
    await client.upsert(COLLECTION_NAME, {
      points: [
        {
          id: data.contentId,
          payload: payload,
          vector: embeddings,
        },
      ],
    });
    console.log("Qdrant Created id:", data.contentId);
  } catch (error) {
    console.error("Error upserting points:", error);
  }
};

export const QdrantSearch = async (embeddings: number[]) => {
  await ensureCollectionExists();
  try {
    const response = await client.search(COLLECTION_NAME, {
      vector: embeddings,
      limit: 3,
    });
    return response.map((res) => res.id);
  } catch (error) {
    console.error("Error searching for points:", error);
  }
};

export const QdrantDelete = async (contentId: string) => {
  await ensureCollectionExists();
  try {
    await client.delete(COLLECTION_NAME, {
      points: [contentId],
    });
    console.log("Qdrant Deleting id:", contentId);
  } catch (error) {
    console.error("Error deleting points:", error);
  }
};
