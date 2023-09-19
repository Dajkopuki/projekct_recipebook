async function update(video,connection) {
    const videos = connection.collection("videos");
    await videos.deleteOne({link:video.link.oldLink});
    let query = {link: new RegExp( `^(?:https?://)?(?:www.)?youtube.com/embed/${video.link.newLink.substring(video.link.newLink.lastIndexOf("/") + 1, video.link.newLink.length)}$`)};
    const foundVideo = await videos.findOne(query);
    if (foundVideo) {
        throw "video with same link is already in database"
    }
    
    video.modified = new Date();
    video.link = video.link.newLink;
    await videos.insertOne(video);
    return video;
};

module.exports = update ;