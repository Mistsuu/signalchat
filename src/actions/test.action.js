import { TestApi } from "api";

export async function fetchTest() {
  var response = await TestApi.testGet();
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

export async function postTest(data) {
  var response = await TestApi.testPost(data);
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

export async function getAuthorTest() {
  var response = await TestApi.testAuthorizationGet();
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};

export async function postAuthorTest(data) {
  var response = await TestApi.testAuthorizationPost(data);
  if (response.ok) {
    return response.data;
  } else {
    throw response.problem;
  }
};