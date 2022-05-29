const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors")

const initialEditorValue={
    document: {
      nodes: [
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              text: "Random Text here",
            },
          ],
        },
      ],
    },
  }

const groupData = {};

io.on("connection", function(socket) {
    socket.on("new-operations", function(data) {
      groupData[data.groupId] = data.value;
      io.emit(`new-remote-operations-${data.groupId}`, data);
    });
  });

app.use(cors({
    origin:'http://localhost:3000'
}))

app.get("/groups/:id", (req, res) => {
    const { id } = req.params;
    if (!(id in groupData)) {
      groupData[id] = initialEditorValue;
    }
  
    res.send(groupData[id]);
  });

http.listen(5000, function() {
  console.log("listening on *:5000");
});

