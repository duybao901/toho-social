export const checkImage = (file) => {
    let err = ""
    if (!file) return err = "File does not exist."

    if (file.size > 1024 * 1024) // 1mb
        err = "The largest image size is 1mb."

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        err = "Image format is incorrect."

    return err;
}

export const imagesUpload = async (images) => {
    let imageArr = [];
    for (const item of images) {
        const formData = new FormData();
        if (item.camera) {
            formData.append('file', item.camera);
        } else {
            formData.append('file', item);
        }

        formData.append("upload_preset", "au4f35zn")
        formData.append("cloud_name", "dxnfxl89q")

        try {
            const data = await fetch("https://api.cloudinary.com/v1_1/dxnfxl89q/upload", {
                method: "POST",
                body: formData
            })
            const res = await data.json();
            imageArr.push({ public_id: res.public_id, url: res.secure_url });
        } catch (err) {
            console.log(err);
        }

    }
    return imageArr;
}