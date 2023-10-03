export const IMAGE_LIST_DATA = [
  {
    "index": "drg_0",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_1",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_2",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_3",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_4",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_5",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_6",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_7",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_8",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_9",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_10",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_11",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_12",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_13",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_14",
    "isValidPlaced": false,
    "placed": false
  },
  {
    "index": "drg_15",
    "isValidPlaced": false,
    "placed": false
  }
]

export const IMAGE_WIDTH = 400;
export const IMAGE_HEIGHT = 400;
export const allowedFileType = ['image/png', 'image/jpeg', 'image/jpg'];

export enum MessageType {
  success = "success",
  error = "error"
}

export const ErrorMessage = {
  invalidFileType: "File type is not allowed",
  invalidImageSize: "Please select proper size of image",
  samePlacePieceError: "You can not place two piece at same place",
  pieceMoveError: "You can not move solved puzzle"
}

export const StorageKey = 'cp-puzzle-piece'
