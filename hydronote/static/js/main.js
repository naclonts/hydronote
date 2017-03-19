
// Set up text editor
tinymce.init({
    selector: '#note-text',
    theme: 'modern',
    resize: 'both',
    width: "95%",
    height: 300,
    plugins: [
      'advlist autolink link lists charmap preview hr anchor pagebreak',
      'searchreplace wordcount visualchars code fullscreen insertdatetime nonbreaking emoticons template paste textcolor save'
    ],
    //    content_css: 'css/content.css',
    toolbar: 'save undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons',
    
    // allow users to save even when no changes have been made in tinyMCE editor (since title might've been changed)
    save_enablewhendirty: false
});