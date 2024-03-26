---
title: Schema diff
subtitle: Learn how to use Neon's Schema Diff tool to compare branches of your database
enableTableOfContents: true
---

Neon's Schema Diff tool provides an easy way to compare the SQL schemas of two branches within a project. Whether you're reviewing changes before restoring branches, auditing historical schema changes, or ensuring consistency across environments, Schema Diff offers an intuitive, side-by-side visual comparison similar to diff tools used for code review.

## Key Features

- **Visual Comparisons**: View changes between schemas in a side-by-side layout, highlighting additions, deletions, and modifications.
- **Integration with Time Travel Assist**: Directly compare schemas at different points in time within the same branch or across branches.
- **Support for Multiple Databases**: Compare schemas across all databases contained within a branch, offering comprehensive coverage of your project's data structure.

## How to Use Schema Diff

### Accessing Schema Diff

Schema Diff is integrated into the Neon Console, enabling quick access from the **Branches** page. Select the branches you wish to compare and click on the **Schema Diff** button.

### Running a Comparison

1. **Select the Target Branch**: This is the branch you're currently working on or interested in comparing.
2. **Choose the Comparison Branch**: Select another branch or a point in time within the same branch to compare against the target.
3. **View the Differences**: The Schema Diff tool displays the SQL script differences side-by-side, clearly marking additions, deletions, and modifications.

### Understanding the Output

- **Green Highlight**: Indicates additions or new elements in the schema.
- **Red Highlight**: Marks deletions or removed elements from the schema.
- **Blue Highlight**: Shows modifications or changes to existing schema elements.

## Practical Applications

- **Pre-Merge Reviews**: Before merging feature branches into the main branch, use Schema Diff to ensure only intended schema changes are applied.
- **Audit Changes**: Historically compare schema changes to understand the evolution of your database structure.
- **Consistency Checks**: Ensure environmental consistency by comparing schemas across development, staging, and production branches.

## Limitations

- **Large Schemas**: Very large database schemas may result in longer loading times for the comparison output.
- **Binary Data**: Schema Diff focuses on textual SQL schema representation and might not fully represent binary data or specific database extensions.

For more details on how to effectively use the Schema Diff tool within your workflow, see our comprehensive guide [here](/docs/guides/schema-diff-tutorial).


