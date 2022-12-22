function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function format({ data, selectValue, formatData }) {
  const nodes = formatData.filter(({ mark }) => {
    const find = selectValue.findIndex((val) => val === mark);
    return find > -1;
  });
  const edges = () => {
    const find = data.filter(({ parent, child }) => {
      const parentIndex = nodes.findIndex(({ id }) => id === `${parent?.id}`);
      const childIndex = nodes.findIndex(({ id }) => id === `${child?.id}`);
      return parentIndex > -1 && childIndex > -1;
    });
    return find.map((item) => {
      const [parent] = nodes.filter((list) => {
        return list.id === `${item.parent?.id}`;
      });
      const [child] = nodes.filter((list) => {
        return list.id === `${item.child?.id}`;
      });
      const sourcePortId = () => {
        const [port] = parent?.ports.filter((item) => {
          return item.type === "output";
        });
        return port?.id;
      };
      const targetPortId = () => {
        const [port] = child?.ports.filter((item) => {
          return item.type === "input";
        });
        return port?.id;
      };
      return {
        id: uuidv4(),
        source: `${item.parent?.id}`,
        target: `${item.child?.id}`,
        sourcePortId: sourcePortId(),
        targetPortId: targetPortId(),
      };
    });
  };
  return {
    nodes,
    edges: edges(),
  };
}

addEventListener(
  "message",
  function (e) {
    const data = format({ ...e.data });
    this.postMessage(data);
  },
  false
);
