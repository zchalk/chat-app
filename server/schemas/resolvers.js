const { gql } = require('apollo-server-express')
const Message = require('../models/Message')
const User = require('../models/User')
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const postMessage = async (parent, args, { req, pubsub }) => {      //parent mutation type
    if (args.input.content.trim() === "") throw new Error('Content is required')
    //const currentUser = await authCheck(req)
    const currentUser = 'test2@test.com'
    const currentUserMongoId = await User.findOne({
        email: currentUser
    })
    let newMessage = await new Message({
        ...args.input, //should contain most of the required info for new Post
        postUser: currentUserMongoId
    }).save()
    newMessage.populate("postUser", "_id username")
    console.log('pubsub within postCreate resolver', pubsub)
    pubsub.publish("NEW_POST", { messageSent: newMessage })
    return newMessage
}
const allMessages = async (parent, args) => {
    const messages = await Message.find({})
    console.log(messages)
    return await Message.find({})//.populate('postUser', 'username _id')

}
const allUsers = async (parent, args) => {
    return await User.find({})
}
const userMessages = async (parent, args, { req }) => {
    //const currentUser = await authCheck(req)
    const currentUser = req.body.email
    const currentUserMongoID = await User.findOne({
        email: currentUser.email
    })
    return await Message.find({ postUser: currentUserMongoID }).populate('postUser', "_id username").sort({ createdAt: -1 })
}

const messageSent = {
    subscribe: () => pubsub.asyncIterator(["NEW_POST"])
}
module.exports = {
    Query: {
        allUsers,
        userMessages,
        allMessages,
    },
    Mutation: {
        postMessage,
    },
    Subscription: {
        messageSent
    }
}