var Graphs;
(function (Graphs) {
    class GraphSource {
    }
    Graphs.GraphSource = GraphSource;
    /**
     * Extendable Vertex of the graph, can have other properties
     */
    class Vertex {
        //[userProperty: string]: any;
        constructor(view, source) {
            this.view = undefined;
            this.view = view;
            this.source = source;
        }
        //get id(): string { return this.view.getVertexId(this.source); };
        get title() { return this.view.getVertexTitle(this.source); }
        ;
        get edges() { return this.view.getVertexEdges(this.source); }
        ;
        get navigationLinks() {
            return this.view.getVertexNavLinks(this.source);
        }
        ;
    }
    Graphs.Vertex = Vertex;
    /*
    * Extendable nav link of the graph, allows to navigate to another graph source and another view
    */
    class NavigationLink {
    }
    Graphs.NavigationLink = NavigationLink;
    /**
     * Edge of the graph
     */
    class Edge {
        constructor(view, sourceEdge) {
            this.view = view;
            this.sourceEdge = sourceEdge;
        }
        //id: string;
        get title() {
            return this.view.getEdgeTitle(this.sourceEdge);
        }
    }
    Graphs.Edge = Edge;
    /**
     * Base class of Dynamic view, which allows to visualize the same graph model in different ways
     */
    class View {
        constructor(source) {
            this.vertices = undefined;
            this.edges = undefined;
            this.graphSource = source;
        }
        generateVerticies() {
            var res = [];
            for (var sv of this.graphSource.vertices) {
                res.push(new Vertex(this, sv));
            }
            return res;
        }
        getAllVertices() {
            if (!this.vertices)
                this.vertices = this.generateVerticies();
            return this.vertices;
        }
        generateEdges() {
            var result = [];
            var allVertexes = this.getAllVertices();
            for (let v of allVertexes) {
                let allEdges = v.edges || [];
                for (let e of allEdges) {
                    if (result.indexOf(e) == -1) {
                        if (allVertexes.indexOf(this.getEdgeFrom(e)) > -1
                            && allVertexes.indexOf(this.getEdgeTo(e)) > -1)
                            result.push(e);
                    }
                }
            }
            for (let e of this.graphSource.edges) {
                if (result.indexOf(e) == -1) {
                    if (allVertexes.indexOf(this.getEdgeFrom(e)) > -1
                        && allVertexes.indexOf(this.getEdgeTo(e)) > -1)
                        result.push(e);
                }
            }
            return result;
        }
        getAllEdges() {
            if (!this.edges)
                this.edges = this.generateEdges();
            return this.edges;
        }
        getVertexTitle(vertexSource) {
            return vertexSource.title;
        }
        getVertexEdges(vertexSource) {
            return vertexSource.edges;
        }
        getVertexNavLinks(vertex) {
            return vertex.navigationLinks;
        }
        getEdgeTitle(edge) {
            return edge.title;
        }
        getEdgeFrom(edge) {
            return edge.from;
        }
        getEdgeTo(edge) {
            return edge.to;
        }
    }
    Graphs.View = View;
})(Graphs || (Graphs = {}));
//# sourceMappingURL=graph.js.map