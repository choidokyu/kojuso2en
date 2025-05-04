const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const keyword = event.queryStringParameters.keyword;
  const confmKey = "U01TX0FVVEgyMDI1MDUwNDE0MDc1MDExNTcxODU=";

  const apiUrl = `https://business.juso.go.kr/addrlink/addrEngApi.do?confmKey=${confmKey}&keyword=${encodeURIComponent(keyword)}&resultType=json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("📦 전체 API 응답:", JSON.stringify(data));

    const juso = data.results?.juso?.[0];

    if (!juso) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          roadAddrEng: "검색 결과 없음",
          zipNo: "",
          raw: data
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        roadAddrEng: juso.roadAddrEng || juso.engAddr || "영문 주소 없음",
        zipNo: juso.zipNo || "우편번호 없음",
        raw: juso
      }),
    };

  } catch (error) {
    console.error("❌ API 호출 실패:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API 호출 오류 발생" }),
    };
  }
};
