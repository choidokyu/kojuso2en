const fetch = require("node-fetch");

exports.handler = async function (event) {
  const { keyword } = event.queryStringParameters;
  /*const confmKey = "devU01TX0FVVEgyMDI1MDUwNDExNDk1ODExNTcxODE=";*/
  /*const confmKey = "U01TX0FVVEgyMDI1MDUwNDEzNTg0MTExNTcxODQ=";*/
  const confmKey = "U01TX0FVVEgyMDI1MDUwNDE0MDc1MDExNTcxODU=";

  if (!keyword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "검색어가 없습니다." })
    };
  }

  const url = `https://business.juso.go.kr/addrlink/addrEngApi.do?confmKey=${confmKey}&keyword=${encodeURIComponent(keyword)}&resultType=json`;

  try {
    const response = await fetch(url);
    
    const data = await response.json();
    console.log("📦 API 응답:", JSON.stringify(data));

    if (data.results.common.errorCode === "0" && data.results.juso.length > 0) {
      const juso = data.results.juso[0];
      return {
        statusCode: 200,
        body: JSON.stringify({
          roadAddrEng: juso.roadAddrEng,
          zipNo: juso.zipNo
        })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: data.results.common.errorMessage })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API 호출 중 오류 발생" })
    };
  }
};
