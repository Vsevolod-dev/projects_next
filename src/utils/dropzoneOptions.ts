import { DropzoneOptions } from "dropzone";

const options: DropzoneOptions = {
    url: `${process.env.NEXT_PUBLIC_API_HOST}/upload`,
    method: "post",
    parallelUploads: 10,
    uploadMultiple: false,
    maxFilesize: 10,
    paramName: "filetoupload",
    createImageThumbnails: true,
    maxThumbnailFilesize: 10,
    thumbnailWidth: 100,
    thumbnailHeight: 100,
    clickable: "#previews",
    ignoreHiddenFiles: true,
    acceptedFiles: ".png, .jpg, .jpeg,",
    autoProcessQueue: true,
    addRemoveLinks: true,
    previewsContainer: "#previews",
    dictDefaultMessage: "Для загрузки файлов, поместите их в данную область",
    dictRemoveFile: "Удалить файл"
}

export default options