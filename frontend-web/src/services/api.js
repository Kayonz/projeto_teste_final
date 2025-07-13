const fetchUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    }, 100);
  });
};

export default fetchUsers;


