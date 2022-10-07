import { TestApi } from "api";

async function fetchTest() {
  var response = await TestApi.testGet();
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

async function postTest(data) {
  var response = await TestApi.testPost(data);
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

async function getAuthorTest() {
  var response = await TestApi.testAuthorizationGet();
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

async function postAuthorTest() {
  var response = await TestApi.testAuthorizationPost();
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

export {
  fetchTest,
  postTest,
  getAuthorTest,
  postAuthorTest,
};