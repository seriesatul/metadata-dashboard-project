// src/graphql/queries.js
import { gql } from "@apollo/client";

export const GET_DATASETS = gql`
  query GetDatasets($page: Int, $limit: Int, $search: String, $tags: [String]) {
    datasets(page: $page, limit: $limit, search: $search, tags: $tags) {
      totalCount
      datasets {
        id
        name
        owner {
          name
        }
        lastUpdated
        tags
      }
    }
  }
`;

export const GET_DATASET_DETAILS = gql`
  query GetDatasetDetails(
    $page: Int
    $limit: Int
    $search: String
    $tags: [String]
    $updatedSince: String
  ) {
    dataset(
      page: $page
      limit: $limit
      search: $search
      tags: $tags
      updatedSince: $updatedSince
    ) {
      id
      name
      description
      owner {
        name
        email
      }
      lastUpdated
      schema {
        name
        type
        description
      }
      lineage {
        upstream {
          name
        }
        downstream {
          name
        }
      }
      usage {
        date
        queries
      }
      freshness {
        date
        lastUpdated
      }
      totalCount
      datasets {
        id
        name
        owner {
          name
        }
        lastUpdated
        tags
      }
    }
  }
`;
