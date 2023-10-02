import Axios from "axios";
export const getImage = async (query: string) => {
  try {
    const rawImage = await Axios.get(
      `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    return rawImage.data.results[0].urls.regular;
  } catch (error) {
    console.log("error getting image", error);
  }
};
