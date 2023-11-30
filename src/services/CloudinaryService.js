const baseUrl = "https://api.cloudinary.com/v1_1/dfidodjf9/";

export default {
    async uploadFile(file) {
        const fd = new FormData();
        fd.append('upload_preset', "qklzbcxk");
        fd.append('file', file);

        const response = await fetch(baseUrl + "upload", {
            method: 'POST',
            body: fd,
        });

        const data = await response.json();
        console.log(data);
        return data.secure_url;
    }
}