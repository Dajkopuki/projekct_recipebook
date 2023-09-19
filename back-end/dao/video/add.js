async function add(video,connection) {
    const videos = connection.collection("videos");
    let query = {link: new RegExp( `^(?:https?://)?(?:www.)?youtube.com/embed/${video.link.substring(video.link.lastIndexOf("/") + 1, video.link.length)}$`)};
    const foundVideo = await videos.findOne(query);
    if (foundVideo) {
        throw "video with same link is already in database"
    }
    video.added = new Date();
    video.modified = new Date();
    await videos.insertOne(video);
    return video;
};

module.exports =  add;