import { Injectable } from '@nestjs/common';
import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { text } from 'stream/consumers';

@Injectable()
export class PineconeService {

    private pineconeClient: Pinecone;
    private indexName: Index<RecordMetadata>;
    
    constructor() {
        this.pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });
        this.indexName = this.pineconeClient.index( {name: "rag"} )
    }

    public async createMemory(id: string, text: string) {
        const namespace = this.indexName.namespace(id);
        await namespace.namespace(`bot-${123}`).upsertRecords({
            records: [
                {
                    id: `msg-${Date.now()}`,
                    text: text // Your raw string text
                }
            ]
        });
    }

    public async queryMemory(id: string, query: string): Promise<String> {
        const results = await this.indexName.searchRecords({
            namespace: `bot-123`,
            query: {
                inputs: {
                    text: query
                },
                topK: 3
            },
            fields: ["text"]
        });

        const retrievedContext = results.result?.hits
        ?.map(hit => {
            // Fix: Cast the generic 'object' type to an indexable key-value record
            const fields = hit.fields as Record<string, any>;
            return fields?.text;
        })
        .filter(Boolean)
        .join('\n---\n') || '';

        return retrievedContext;
    }

}
