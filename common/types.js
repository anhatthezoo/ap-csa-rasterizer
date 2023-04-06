class StaticMesh {
    constructor(filePath) {
        this.filePath = filePath;
        this.vertices = [];
        this.faces = [];

        this.loadModel();
    }

    loadModel() {
        fetch(this.filePath).then(res => {
            if (!res.ok) throw new Error("Failed to fetch file");
    
            return res.blob();
        })
        .then(blob => {
            let reader = new FileReader();
            reader.onload = (e => {
                for (const line of e.target.result.split("\n")) {
                    this.addVertex(line);
                    this.addFace(line);
                }
            })
            reader.readAsText(blob);
        })
    }

    addVertex(data) {
        if (data.substring(0, 2) != "v ") return;
        this.vertices.push([
            data.split(" ")[1], 
            data.split(" ")[2], 
            data.split(" ")[3]
        ]);
    }

    addFace(data) {
        if (data.substring(0, 2) != "f ") return;

        let v0 = data.split(" ")[1].split("/");
        let v1 = data.split(" ")[2].split("/");
        let v2 = data.split(" ")[3].split("/");

        this.faces.push([v0[0], v1[0], v2[0]]);
    }
}