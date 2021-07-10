const messages = [];
const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, {user, content}) => {
            const id = messages.length
            messages.push({ id, user, content });
            return id;
        }
    }
}
module.exports = resolvers;