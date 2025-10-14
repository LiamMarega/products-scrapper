import { DocumentNode, GraphQLNamedType, GraphQLSchema, OperationDefinitionNode } from 'graphql';
export type TypeTree = {
    operation: TypeTreeNode;
    fragments: {
        [name: string]: TypeTreeNode;
    };
};
/**
 * Represents a GraphQLNamedType which pertains to an input variables object or an output.
 * Used when traversing the data object in order to provide the type for the field
 * being visited.
 */
export type TypeTreeNode = {
    type: GraphQLNamedType | undefined;
    parent: TypeTreeNode | TypeTree;
    isList: boolean;
    fragmentRefs: string[];
    children: {
        [name: string]: TypeTreeNode;
    };
};
/**
 * This class is used to transform the values of input variables or an output object.
 */
export declare class GraphqlValueTransformer {
    private schema;
    private outputCache;
    private inputCache;
    constructor(schema: GraphQLSchema);
    /**
     * Transforms the values in the `data` object into the return value of the `visitorFn`.
     */
    transformValues(typeTree: TypeTree, data: Record<string, unknown>, visitorFn: (value: any, type: GraphQLNamedType) => any): void;
    /**
     * Constructs a tree of TypeTreeNodes for the output of a GraphQL operation.
     */
    getOutputTypeTree(document: DocumentNode): TypeTree;
    /**
     * Constructs a tree of TypeTreeNodes for the input variables of a GraphQL operation.
     */
    getInputTypeTree(definition: OperationDefinitionNode): TypeTree;
    private getChildrenTreeNodes;
    private isList;
    private deepMergeChildren;
    private getTypeNodeByPath;
    private traverse;
    private isTypeTree;
}
