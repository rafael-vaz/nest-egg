import { EditorProps } from "../@types/tinymce";

const apiKey = "no-api-key";

function getCleanEditorConfig(placeholderText: string) {
  const cleanEditorConfig: EditorProps = {
    apiKey,
    licenseKey: "gpl",
    init: {
      placeholder: placeholderText,
      language: "pt_BR",
      height: 100,
      autoresize_bottom_margin: 1,
      toolbar:
        "bold italic underline | superscript subscript | bullist numlist | align  | link searchreplace | emoticons",
      quickbars_insert_toolbar: "emoticons",
      quickbars_selection_toolbar:
        "bold italic underline | bullist numlist | align | quicklink",
      statusbar: false,
      media_poster: false,
      media_alt_source: false,
      media_dimensions: false,
      plugins:
        "quickbars autoresize lists link preview searchreplace emoticons",
      link_default_target: "_blank",
      menubar: false,
      content_css: `${import.meta.env.BASE_URL}libs/tinymce/tinymce.css`,
    },
  };
  return cleanEditorConfig;
}

export default getCleanEditorConfig;
