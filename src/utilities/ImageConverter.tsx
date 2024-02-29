import axios from 'axios';

const API_BASE_URL = 'https://api.cloudconvert.com/v2';
const API_KEY = import.meta.env.VITE_API_KEY;

export const convertPDFToPNG = async (file: File) => {
    // Initialize the API call to create a job for conversion
    const jobResponse = await axios.post(
        `${API_BASE_URL}/jobs`,
        {
            "tasks": {
                "import-my-file": {
                    "operation": "import/upload"
                },
                "convert-my-file": {
                    "operation": "convert",
                    "input": "import-my-file",
                    "output_format": "png",
                    "engine": "poppler"
                },
                "export-my-file": {
                    "operation": "export/url",
                    "input": "convert-my-file"
                }
            }
        },
        {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    // Upload the file to the provided URL from the job creation response
    const uploadUrl = jobResponse.data.data.tasks.find((task: { name: string; }) => task.name === "import-my-file").result.form.url;
    const formData = new FormData();
    Object.entries(jobResponse.data.data.tasks.find((task: { name: string; }) => task.name === "import-my-file").result.form.parameters).forEach(([key, value]) => {
        formData.append(key, value as string); // Asserting value as string
    });
    formData.append('file', file);
    await axios.post(uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    // Wait for the job to complete (in production, use a more sophisticated approach, e.g., polling or webhooks)
    let jobStatusResponse;
    do {
        jobStatusResponse = await axios.get(`${API_BASE_URL}/jobs/${jobResponse.data.data.id}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
    } while (jobStatusResponse.data.data.status !== 'finished' && jobStatusResponse.data.data.status !== 'error');

    if (jobStatusResponse.data.data.status === 'error') {
        throw new Error('Error during the conversion process.');
    }

    // Retrieve the output file URL
    const outputFileUrl = jobStatusResponse.data.data.tasks.find((task: { name: string; }) => task.name === "export-my-file").result.files[0].url;

    return outputFileUrl;
};