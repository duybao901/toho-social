var users = [];

const EditData = (data, id, edit) => {
    const newData = data.map(item =>
        item.id === id ? { ...item, call: edit } : item
    )
    return newData;
}

const socketSever = (socket) => {

    socket.on('joinUser', user => {
        users.push({ socketId: socket.id, id: user._id, followers: user.followers });
    })

    socket.on('disconnect', () => {
        // Nếu user disconnect thì thông báo cho những người mà dang follow user đó 

        const data = users.find(user => user.socketId === socket.id);

        if (data) {
            const clients = users.filter(user =>
                data.followers.find(item => item._id === user.id)
            )
            if (clients.length > 0) {
                clients.forEach(client => {
                    // Gửi id của mình đến những user đang follow mình  
                    socket.to(`${client.socketId}`).emit("checkUserOffLine", data.id);
                })
            }

            // End call
            if (data.call) {
                const userCall = users.find(use=r => user.id === data.call);
                if (userCall) {
                    users = EditData(users, userCall.id, null);
                    socket.to(`${userCall.socketId}`).emit('callerDisconnect', data);
                }
            }
        }
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

    // Check user online & offline
    socket.on("checkUserOnline", data => {

        // Gửi cho mình tín hiệu của những thằng mà mình dang follow nó mà nó đang online
        const following = users.filter(user =>
            data.followings.find(item => item._id === user.id)
        );
        following && socket.emit("checkUserOnlineToMe", following)

        // Gửi đến những thằng mà đang follow mình tín hiệu mình đang online
        const clients = users.filter(user =>
            data.followers.find(item => item._id === user.id)
        )

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("checkUserOnlineToClient", data._id);
            })
        }
    })

    // Call User
    socket.on("callUser", data => {
        // console.log('old users', users)

        users = EditData(users, data.sender, data.recipient);

        // Tìm user nhận cuộc gọi
        const client = users.find(user => user.id === data.recipient);
        if (client) {
            // Nếu người gọi đang có call
            if (client.call) {
                users = EditData(users, data.sender, null);
                socket.emit("userBusy", data);
            } else {
                // Nếu người gọi không có call
                users = EditData(users, data.recipient, data.sender);
                socket.to(`${client.socketId}`).emit("callUserToClient", data);
            }
        }
        // console.log('new users', users)
    })

    // End call
    socket.on("endCall", data => {
        // client -> me
        const client = users.find(user => user.id === data.sender)
        if (client) {
            // Trường hợp bên nhận ngắt kết nối
            socket.to(`${client.socketId}`).emit('endCallToClient', data);
            users = EditData(users, data.sender, null)
            if (client.call) {
                // clientAll -> you
                const clientAll = users.find(user => user.id === client.call);
                // Trường hợp bên mình ngắt kết nối
                clientAll && socket.to(`${clientAll.socketId}`).emit('endCallToClient', data);
                users = EditData(users, data.recipient, null)
            }
        }
    })
}

module.exports = socketSever;