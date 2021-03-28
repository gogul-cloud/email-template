function buildTemplateAddOn(e) {
  /**
   * Activates scops and return to the templatecard creating function.
   */
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  return buildTemplateCard();
}

function buildTemplateCard(){
  /**
   * Function creates two text fields and one drop down and buttons to get data from the user.
   * @header : Creates Title for the card.
   * @section : Creates a card section.
   * @email : Cretate text input to add email.
   * @subject : Cretate text input to add subject.
   * @templates : Cretate dropdown with email html templates choices.
   * sendButton : Button to send data to the excecuting function creates email.
   * @closeButton : Button to close the current card.
   * @buttonSet : Buttonset holds the two buttons mentioned above.
   * Adding these inputs as widgets to the card.
   * @return : Calls the cardbuilder and returns the card with the required contents.
   */

  var header = CardService.newCardHeader().setTitle('Choose Template And Send Mail');
  var section = CardService.newCardSection();

  var email = CardService.newTextInput()
    .setTitle("To Email")
    .setFieldName("to_email")
    .setSuggestions(CardService.newSuggestions()
    .addSuggestions(getEmails()));

  var subject = CardService.newTextInput()
    .setTitle("Subject")
    .setFieldName("subject")
    .setSuggestions(CardService.newSuggestions()
    .addSuggestions(getSubjects()));
  
  var templates = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Templates")
    .setFieldName("templates")
    .addItem("Personal","Personal", false)
    .addItem("Internal","Personal", false)
    .addItem("Invitation","Invitation", false)
    .addItem("Confidential","Confidential", false)
    .addItem("Leave Request","Leave_Request", false)
    .addItem("Query","Query", false);

  var sendButton = CardService.newTextButton()
    .setText('Send')
    .setOnClickAction(CardService.newAction()
                      .setFunctionName('createMail')
                      );
  var closeButton = CardService.newTextButton()
    .setText('Close')
    .setOnClickAction(CardService.newAction()
        .setFunctionName('close'));
  
  var buttonSet = CardService.newButtonSet()
    .addButton(sendButton)
    .addButton(closeButton);
  
  section.addWidget(email)
  section.addWidget(subject)
  section.addWidget(templates)
  section.addWidget(buttonSet)

  return CardService.newCardBuilder()
    .setHeader(header)
    .addSection(section)
    .build();
}

function createMail(e) {
  /**
   * @template : user selected template value.
   * @toEmail : user chosen mail.
   * @subject : subject from user.
   * @templ : selecting the template html.
   * @body : create template.
   * @mail : Create mail with the user given.
   * @card : Card to show the composed email with the content.
   * @return : Open draft mail or error message card.
   * If the process throwing error a new card builds with error message.
   */

  var template = e.formInputs['templates'];
  var toEmail = e.formInputs['to_email'];
  var subject = e.formInputs['subject'];
  var templ = HtmlService.createTemplateFromFile(template);
  var body = templ.evaluate().getContent();

  try{
    var mail = GmailApp.createDraft(
      toEmail, 
      subject,
      "",
      {htmlBody:body});
    var card = CardService.newComposeActionResponseBuilder().setGmailDraft(mail);
    return card.build();
  }

  catch(e){
    var header = CardService.newCardHeader().setTitle("Entered data is in correct Try Again");
    var card = CardService.newCardBuilder().setHeader(header);
    return CardService.newNavigation().updateCard(card.build());
  }
  }

function getSubjects(){
  /**
   * @threads : Get inbox threads.
   * @subjects: Adds all subjects into this list.
   * @return : Return the subjects list.
   */

  var threads = GmailApp.getInboxThreads(0,50);
  var subjects = [];

  for (var i = 0; i < threads.length; i++) {
    subjects.push(threads[i].getFirstMessageSubject());
  }
  
  return subjects;
}

function getEmails(){
  /**
   * @threads : Get inbox threads.
   * @messages: Get messages thread.
   * @fromEmails: List from emails in the gmail.
   * @return : Return the from email list.
   */

  var threads = GmailApp.getInboxThreads(1 ,50);
  var messages = GmailApp.getMessagesForThreads(threads); 
  var fromEmails = [];
    messages.get
      for(var i = 0; i < threads.length; i++)
    {
       fromEmails.push(messages[i][0].getFrom().split("<")[0]);
    }
  return fromEmails;
}

function close() {
  /**
   * @card : Creates new card.
   * @return : Return blank card.
   */
  var card = CardService.newCardBuilder();

  return CardService.newNavigation().updateCard(card.build());
}
