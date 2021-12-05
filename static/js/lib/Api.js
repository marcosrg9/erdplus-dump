import axios from "axios"
import { getApiToken } from "./Token"
import config from "../config"

const api = axios.create({
  baseURL: config.apiUrl
})

function getHeaders() {
  const headers = {
    accept: "application/json"
  }
  const token = getApiToken()
  if (token) {
    headers["Authorization"] = token
  }
  return headers
}

function get(route) {
  return api.get(route, {
    headers: getHeaders()
  })
}

function post(route, body) {
  return api.post(route, body, {
    headers: getHeaders()
  })
}

function put(route, body) {
  return api.put(route, body, {
    headers: getHeaders()
  })
}

function del(route) {
  return api.delete(route, {
    headers: getHeaders()
  })
}

// Session

export function getSession() {
  return get("/api/session")
}

export function postEmailSession(body) {
  return post("/api/session", body)
}

export function postGoogleSession(body) {
  return post("/api/google-session", body)
}

// Folders

export function getFolders() {
  return get("/api/folders")
}

export function postFolder(payload) {
  return post("/api/folders", payload)
}

export function putFolder(payload) {
  return put(`/api/folders/${payload.id}`, payload)
}

export function deleteFolder(folderId) {
  return del(`/api/folders/${folderId}`)
}

// Diagrams

export function getDiagrams() {
  return get("/api/diagrams")
}

export function putDiagram(payload) {
  return put(`/api/diagrams/${payload.id}`, payload)
}

export function postDiagram(payload) {
  return post("/api/diagrams", payload)
}

export function deleteDiagram(diagramId) {
  return del(`/api/diagrams/${diagramId}`)
}

// Account

export function getAccount() {
  return get("/api/account")
}

export function postAccount(payload) {
  return post("/api/account", payload)
}

export function putAccount(payload) {
  return put("/api/account", payload)
}

export function deleteAccount() {
  return del("/api/account")
}

export function postChangePassword(payload) {
  return post("/api/account/password", payload)
}

export function postMigrateSocial(payload) {
  return post("/api/account/migrate-social", payload)
}

// Reset password

export function postResetPasswordStart(payload) {
  return post("/api/reset-password", payload)
}

export function putResetPasswordStart(payload) {
  return put(`/api/reset-password/${payload.token}`, {
    password: payload.password
  })
}
