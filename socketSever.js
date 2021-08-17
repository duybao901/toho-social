var users = [];

const socketSever = (socket) => {

    socket.on('joinUser', id => {
        users.push({ socketId: socket.id, id });
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
    })

    // Like
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("likeToClient", newPost);
            }
        })
    })

    // unLike
    socket.on('unlikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("unlikeToClient", newPost);
            }
        })
    })

    // createComment
    socket.on("createComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("createCommentToClient", newPost);
            }
        })
    })

    // createComment
    socket.on("removeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("removeCommentToClient", newPost);
            }
        })
    })

    // Like Comment
    socket.on("likeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("likeCommentToClient", newPost);
            }
        })
    })

    // UnLike Comment
    socket.on("unlikeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("unlikeCommentToClient", newPost);
            }
        })
    })

    // UnLike Comment
    socket.on("updateComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        users.forEach(user => {
            if (ids.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("updateCommentToClient", newPost);
            }
        })
    })

    // Follow User
    socket.on('followUser', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit("followUserToClient", newUser);
    });

    // UnFollow User
    socket.on('unfollowUser', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit("unfollowUserToClient", newUser);
    });

    // Create Notify
    socket.on('createNotify', msg => {
        users.forEach(user => {
            if (msg.recipients.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("createNotifyToClient", msg);
            }
        })
    });

    // Remove Notify
    socket.on('removeNotify', msg => {
        users.forEach(user => {
            if (msg.recipients.includes(user.id)) {
                socket.to(`${user.socketId}`).emit("removeNotifyToClient", msg);
            }
        })
    });

    // Message
    socket.on("addMessage", msg => {
        const user = users.find(user => user.id === msg.recipient);
        user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    })
}

module.exports = socketSever;