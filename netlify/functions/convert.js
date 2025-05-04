const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const keyword = event.queryStringParameters.keyword;
  const confmKey = "U01TX0FVVEgyMDI1MDUwNDE0MDc1MDExNTcxODU="; // 실제 키로 교체하세요

  const apiUrl = `https://business.juso.go.kr/addrlink/addrEngApi.do?confmKey=${confmKey}&keyword=${encodeURIComponent(keyword)}&resultType=json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const errCode = data.results?.common?.errorCode || "9999";
    const errMsg = data.results?.common?.errorMessage || "알 수 없는 오류";

    const juso = data.results?.juso?.[0] || {};

    return {
      statusCode: 200,
      body: JSON.stringify({
        errorCode: errCode,
        errorMessage: errMsg,
        roadAddr: juso.roadAddr || "",
        jibunAddr: juso.jibunAddr || "",
        zipNo: juso.zipNo || "",
        raw: juso
      }),
    };
  } catch (error) {
    console.error("❌ API 호출 실패:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorCode: "9999", errorMessage: "서버 오류", raw: null }),
    };
  }
};
