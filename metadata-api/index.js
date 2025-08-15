// metadata-api/index.js
const { ApolloServer, gql } = require('apollo-server');
const { faker } = require('@faker-js/faker');
const { startOfWeek, subDays, formatISO } = require('date-fns');
const _ = require('lodash');

// --- MOCK DATA GENERATION --- (This section is unchanged)
const TAGS = ['PII', 'Finance', 'Marketing', 'Sales', 'Product', 'GDPR'];
const DATASETS = [];
const NUM_DATASETS = 200;

for (let i = 1; i <= NUM_DATASETS; i++) {
    const lastUpdated = faker.date.recent({ days: 90 });
    const owner = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
    };
    
    const usageHistory = Array.from({ length: 30 }, (_, j) => ({
        date: formatISO(subDays(new Date(), 30 - j)),
        queries: faker.number.int({ min: 5, max: 200 }),
    }));
    const freshnessHistory = Array.from({ length: 7 }, (_, j) => ({
        date: formatISO(startOfWeek(subDays(new Date(), j * 7))),
        lastUpdated: formatISO(faker.date.recent({ days: 3, refDate: subDays(new Date(), j * 7) })),
    }));

    DATASETS.push({
        id: faker.string.uuid(),
        name: `dwh.${faker.word.noun()}_${faker.word.verb()}_${faker.number.int(1000)}`,
        description: faker.lorem.paragraph(),
        owner,
        lastUpdated: formatISO(lastUpdated),
        tags: _.sampleSize(TAGS, faker.number.int({ min: 1, max: 3 })),
        schema: Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
            name: faker.database.column(),
            type: faker.database.type(),
            description: faker.lorem.sentence(),
        })),
        lineage: {
            upstream: [{ id: faker.string.uuid(), name: `source_${faker.word.noun()}` }],
            downstream: [{ id: faker.string.uuid(), name: `mart_${faker.word.adjective()}` }],
        },
        usage: usageHistory,
        freshness: freshnessHistory,
    });
}

// --- GRAPHQL SCHEMA DEFINITION (typeDefs) --- (This section is unchanged)
const typeDefs = gql`
    type Query {
       datasets(page: Int, limit: Int, search: String, tags: [String], updatedSince: String): DatasetConnection!
        dataset(id: ID!): Dataset
    }

    type DatasetConnection { totalCount: Int!, datasets: [Dataset!]! }
    type Dataset { id: ID!, name: String!, description: String!, owner: User!, lastUpdated: String!, tags: [String!]!, schema: [SchemaColumn!]!, lineage: Lineage!, usage: [UsageDataPoint!]!, freshness: [FreshnessDataPoint!]! }
    type User { id: ID!, name: String!, email: String! }
    type SchemaColumn { name: String!, type: String!, description: String }
    type Lineage { upstream: [LineageNode!]!, downstream: [LineageNode!]! }
    type LineageNode { id: ID!, name: String! }
    type UsageDataPoint { date: String!, queries: Int! }
    type FreshnessDataPoint { date: String!, lastUpdated: String! }
`;

// --- RESOLVERS --- (This section is unchanged)
const resolvers = {
    Query: {
        datasets: (_, { page = 1, limit = 10, search, tags, updatedSince }) => {
            let filteredDatasets = [...DATASETS];
            if (search) {
                const lowerCaseSearch = search.toLowerCase();
                filteredDatasets = filteredDatasets.filter(ds => ds.name.toLowerCase().includes(lowerCaseSearch) || ds.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)));
            }
            if (tags && tags.length > 0) {
                filteredDatasets = filteredDatasets.filter(ds => tags.every(tag => ds.tags.includes(tag)));   
            }
            if (updatedSince) {
                const sinceDate = new Date(updatedSince);
                filteredDatasets = filteredDatasets.filter(ds => new Date(ds.lastUpdated) >= sinceDate);
            }
            const totalCount = filteredDatasets.length;
            const startIndex = (page - 1) * limit;
            const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + limit);
            return { totalCount, datasets: paginatedDatasets, };
        },
        dataset: (_, { id }) => DATASETS.find(ds => ds.id === id),
    },
};

// --- SERVER INSTANCE ---
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    // FIX #2: Add CORS configuration to allow cross-origin requests
    cors: {
        origin: '*', // Allows all origins; more secure to specify your Vercel URL
        credentials: true
    }
});

// FIX #1: Listen on the port designated by Render, or 4000 for local development
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});