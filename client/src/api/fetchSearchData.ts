import axios from "axios";

export async function fetchSearchData(searchValue: string) {
    if (!searchValue.trim()) return [];

    try {
        const response = await axios.post("/api/search", {
            params: { searchValue },
        });
        return response.data.searchData;
    } catch (error) {
        console.error("검색 데이터 가져오기 오류:", error);
        throw error;
    }
}
