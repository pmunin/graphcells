module Graphs
{
    export class GraphSource {
        public vertices: any[];
        public edges: any[];
    }

    export interface IView
    {
        graphSource: GraphSource;

        getAllVertices(): Vertex[];
        getAllEdges(): Edge[];

        getVertexId(vertexSource:any): any; //allow to refer edges
        getVertexTitle(vertexSource: any): string;
        getVertexNavLinks(vertexSource: any): NavigationLink[];

        /*
        * returns edge bodies
        */
        getVertexEdgeBodies(vertexSource: any): any[];

        //edge title
        getEdgeTitle(edgeBody: any, vertexSource?: any): string;
        getEdgeFromVertexId(edgeBody: any, vertexSource?: any): any;
        getEdgeToVertexId(edgeBody: any, vertexSource?: any): any;

        getVertexEdges(vertexSource: any): Edge[];

        /*
            vertices:
            [
                {
                    id:"v1",
                    edgesTo:["v1", "v2", { destinationVertexId:"v5", title:"Edge with body"}]
                },
                {
                    id:"v2"
                },
                {
                    id:"v5",
                    edgesTo:["v1"]
                },
            ]
        */
        //getEdgeFromVertexSource(edgeSource: any): any;
        //getEdgeToVertexSource(edgeSource: any): any;
    }

    /**
     * Extendable Vertex of the graph, can have other properties
     */
    export class Vertex
    {
        source: any;
        view: IView = undefined;

        //get id(): string { return this.view.getVertexId(this.source); };

        get title(): string { return this.view.getVertexTitle(this.source); };

        get edges(): Edge[] { return this.view.getVertexEdges(this.source); };

        get navigationLinks(): NavigationLink[] {
            return this.view.getVertexNavLinks(this.source);
        };
        //[userProperty: string]: any;
        constructor(view: IView, source: any)
        {
            this.view = view;
            this.source = source;
        }
    }

    /*
    * Extendable nav link of the graph, allows to navigate to another graph source and another view
    */
    export class NavigationLink {
        graphUrl: string;
        vertexId: string;
        viewId: string;
    }

    /**
     * Edge of the graph
     */
    export class Edge
    {
        view: IView;
        sourceEdge: any;
        constructor(view: IView, sourceEdge: any) {
            this.view = view;
            this.sourceEdge = sourceEdge;
        }

        //id: string;
        get title(): string {
            return this.view.getEdgeTitle(this.sourceEdge);
        }
        from: Vertex;
        to: Vertex;
    }


    /**
     * Base class of Dynamic view, which allows to visualize the same graph model in different ways
     */
    export abstract class View implements IView
    {
        public graphSource: GraphSource;
        constructor(source: GraphSource)
        {
            this.graphSource = source;
        }

        public generateVerticies(): Vertex[]
        {
            var res: Vertex[] = [];
            for (var sv of this.graphSource.vertices)
            {
                res.push(new Vertex(this, sv));
            }
            return res;
        }
        private vertices: Vertex[] = undefined;
        public getAllVertices(): Vertex[]
        {
            if (!this.vertices)
                this.vertices = this.generateVerticies();

            return this.vertices;
        }
        public generateEdges(): Edge[]
        {
            var result: Edge[] = [];
            var allVertexes = this.getAllVertices();
            for (let v of allVertexes) {
                let allEdges: Edge[] = v.edges || [];
                for (let e of allEdges) {
                    if (result.indexOf(e) == -1) {
                        if (allVertexes.indexOf(this.getEdgeFrom(e)) > -1
                            && allVertexes.indexOf(this.getEdgeTo(e)) > -1
                        )
                            result.push(e);
                    }
                }
            }

            for (let e of this.graphSource.edges) {
                if (result.indexOf(e) == -1) {
                    if (allVertexes.indexOf(this.getEdgeFrom(e)) > -1
                        && allVertexes.indexOf(this.getEdgeTo(e)) > -1
                    )
                        result.push(e);
                }
            }

            return result;
        }

        private edges: Edge[] = undefined;
        public getAllEdges(): Edge[]
        {
            if (!this.edges)
                this.edges = this.generateEdges();
            return this.edges;
        }

        public getVertexTitle(vertexSource: any): string {
            return vertexSource.title;
        }

        public getVertexEdges(vertexSource: any): Edge[]
        {
            return vertexSource.edges;
        }


        public getVertexNavLinks(vertex: Vertex): NavigationLink[] {
            return vertex.navigationLinks;
        }

        public getEdgeTitle(edge: Edge): string {
            return edge.title;
        }
        public getEdgeFrom(edge: Edge): Vertex {
            return edge.from;
        }
        public getEdgeTo(edge: Edge): Vertex {
            return edge.to;
        }

    }

}