import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
  images: [],
  cover: null,
  download: null,
  cardFrontId: null,
  cardBackId: null,
  faceId: null,
  cardFaceId: null,
};

export const uploadFilesSlice = createSlice({
  name: "uploadFile",
  initialState,
  reducers: {
    onAddNewImage: (state, action) => {
      state.images.push(action.payload.uploadFile);
    },
    onRemoveImage: (state, action) => {
      state.images = state.images.filter(
        (item) => item.id !== action.payload.id
      );
    },
    onClearImages: (state) => {
      state.images = [];
    },
    onAddNewFile: (state, action) => {
      state.files.push(action.payload.uploadFile);
    },
    onUpdateFile: (state, action) => {
      const newFiles = state.files.map((item) => {
        if (item.id === action.payload.uploadFile.id) {
          return {
            ...item,
            ...action.payload.uploadFile,
          };
        } else {
          return item;
        }
      });
      state.files = newFiles;
    },
    onRemoveFile: (state, action) => {
      state.files = state.files.filter((item) => item.id !== action.payload.id);
    },
    onClearFile: (state) => {
      state.files = [];
    },
    onAddCover: (state, action) => {
      state.cover = action.payload.uploadFile;
    },
    onUpdateCover: (state, action) => {
      state.cover = { ...state.cover, ...action.payload.uploadFile };
    },
    onRemoveCover: (state) => {
      state.cover = null;
    },
    onAddCardFrontId: (state, action) => {
      state.cardFrontId = action.payload.uploadFile;
    },
    onUpdateCardFrontId: (state, action) => {
      state.cardFrontId = {
        ...state.cardFrontId,
        ...action.payload.uploadFile,
      };
    },
    onRemoveCardFrontId: (state) => {
      state.cardFrontId = null;
    },
    onAddCardBackId: (state, action) => {
      state.cardBackId = action.payload.uploadFile;
    },
    onUpdateCardBackId: (state, action) => {
      state.cardBackId = { ...state.cardBackId, ...action.payload.uploadFile };
    },
    onRemoveCardBackId: (state) => {
      state.cardBackId = null;
    },
    onAddFaceId: (state, action) => {
      state.faceId = action.payload.uploadFile;
    },
    onUpdateFaceId: (state, action) => {
      state.faceId = { ...state.faceId, ...action.payload.uploadFile };
    },
    onRemoveFaceId: (state) => {
      state.faceId = null;
    },
    onAddCardFaceId: (state, action) => {
      state.cardFaceId = action.payload.uploadFile;
    },
    onUpdateCardFaceId: (state, action) => {
      state.cardFaceId = { ...state.cardFaceId, ...action.payload.uploadFile };
    },
    onRemoveCardFaceId: (state) => {
      state.cardFaceId = null;
    },
    onAddDownloadFile: (state, action) => {
      state.download = action.payload.uploadFile;
    },
    onUpdateDownloadFile: (state, action) => {
      state.download = { ...state.download, ...action.payload.uploadFile };
    },
    onRemoveDownloadFile: (state) => {
      state.download = null;
    },
  },
});

export const {
  onAddCover,
  onRemoveCardFrontId,
  onUpdateCardFrontId,
  onAddCardFrontId,
  onAddCardBackId,
  onRemoveCardBackId,
  onUpdateCardBackId,
  onAddCardFaceId,
  onRemoveCardFaceId,
  onUpdateCardFaceId,
  onAddFaceId,
  onUpdateFaceId,
  onRemoveFaceId,
  onRemoveCover,
  onUpdateCover,
  onClearFile,
  onRemoveDownloadFile,
  onAddDownloadFile,
  onUpdateDownloadFile,
  onAddNewImage,
  onRemoveFile,
  onRemoveImage,
  onClearImages,
  onAddNewFile,
  onUpdateFile,
} = uploadFilesSlice.actions;

export const uploadFilesState = (state) => state.uploadFile;

export default uploadFilesSlice.reducer;
