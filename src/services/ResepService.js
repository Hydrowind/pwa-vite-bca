const baseUrl = "https://65661bc1eb8bb4b70ef2e9fe.mockapi.io/api/demo-1/resep/";

const getFetch = async (path) => {
    const request = await fetch(
        path,
        {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }
    );
    return await request.json();
}

const postFetch = async (path, parameter) => {
    const request = await fetch(
        path,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameter)
        }
    );
    return await request.json();
}

const putFetch = async (path, parameter) => {
    const request = await fetch(
        path,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameter)
        }
    );
    return await request.json();
}

const deleteFetch = async (path) => {
    const request = await fetch(
        path,
        {
            method: 'DELETE'
        }
    );

    return await request.json();
}

export default {
    getResep() {
        return getFetch(baseUrl);
    },
    getStepDetail(id) {
        return getFetch(baseUrl + id);
    },
    saveStep(parameter) {
        return postFetch(baseUrl, parameter);
    },
    updateStep(id, parameter) {
        return putFetch(baseUrl + id, parameter);
    },
    deleteStep(id) {
        return deleteFetch(baseUrl + id);
    }
}
