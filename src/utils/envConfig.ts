import { Envs } from "../types/Envs";
import { API } from "../configuration/api";

export const getEnvs = async (): Promise<Envs | undefined> => {
  try {
    const response = await fetch(API.ENV_CONFIG);

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching env config:", error);
  }
};
