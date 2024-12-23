import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.lfsolutions.loatis',
  projectId: '6740edbe003b0557c062',
  databaseId: '6741f64f003351c2f219',
  userCollectionId: '6741f683001fe1bee699',
  videoCollectionId: '6741f6d00028ea0f058a',
  storageId: '6741f8c4002bd2d19fc7'
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) 
  .setProject(config.projectId) 
  .setPlatform(config.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser(email, password, username) {
 try {
  const newAccount = await account.create(
    ID.unique(),
    email,
    password,
    username
  )

  if (!newAccount) throw new Error('Failed to create user')

  const avatarUrl = avatars.getInitials(username)
  
  await signIn(email, password)

  const newUser = await databases.createDocument(
    databaseId,
    userCollectionId,
    ID.unique(),
    {
      accountId: newAccount.$id,
      email,
      username,
      avatar: avatarUrl
    }
  )

  return newUser
 } catch (error) {
  throw new Error(error)
 }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password)

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    if(!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }

}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
    } else {
      throw new Error('Invalid file type')
    }

    if(!fileUrl) throw new Error('File not found')

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const singOut = async () => {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (file, type) => {
  if(!file) return

  const asset = { 
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
   }

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const createVideo = async (form ) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        creator: form.creator,
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
      }
    )

    return newPost
  } catch (error) {
    throw new Error(error)
  }
}