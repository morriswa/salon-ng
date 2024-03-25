
export type SelectorOptions = { val:string, title:string };

export class SelectorDeclarations {

  public static pronounOptions: SelectorOptions[] = [
    {val: 'H', title: 'He/Him/His'},
    {val: 'S', title: 'She/Her/Hers'},
    {val: 'T', title: 'They/Them/Theirs'},
  ];

  public static contactMethodOptions: SelectorOptions[] = [
    {val: 'Email', title: 'Email'},
    {val: 'PhoneCall', title: 'Phone Call'},
    {val: 'TextMessage', title: 'Text Message'},
  ];

  public static stateOptions: SelectorOptions[] = [
    { val: 'AL', title:'Alabama'},
    { val: 'AK', title:'Alaska'},
    { val: 'AZ', title:'Arizona'},
    { val: 'AR', title:'Arkansas'},
    { val: 'CA', title:'California'},
    { val: 'CO', title:'Colorado'},
    { val: 'CT', title:'Connecticut'},
    { val: 'DE', title:'Delaware'},
    { val: 'DC', title:'District Of Columbia'},
    { val: 'FL', title:'Florida'},
    { val: 'GA', title:'Georgia'},
    { val: 'HI', title:'Hawaii'},
    { val: 'ID', title:'Idaho'},
    { val: 'IL', title:'Illinois'},
    { val: 'IN', title:'Indiana'},
    { val: 'IA', title:'Iowa'},
    { val: 'KS', title:'Kansas'},
    { val: 'KY', title:'Kentucky'},
    { val: 'LA', title:'Louisiana'},
    { val: 'ME', title:'Maine'},
    { val: 'MD', title:'Maryland'},
    { val: 'MA', title:'Massachusetts'},
    { val: 'MI', title:'Michigan'},
    { val: 'MN', title:'Minnesota'},
    { val: 'MS', title:'Mississippi'},
    { val: 'MO', title:'Missouri'},
    { val: 'MT', title:'Montana'},
    { val: 'NE', title:'Nebraska'},
    { val: 'NV', title:'Nevada'},
    { val: 'NH', title:'New Hampshire'},
    { val: 'NJ', title:'New Jersey'},
    { val: 'NM', title:'New Mexico'},
    { val: 'NY', title:'New York'},
    { val: 'NC', title:'North Carolina'},
    { val: 'ND', title:'North Dakota'},
    { val: 'OH', title:'Ohio'},
    { val: 'OK', title:'Oklahoma'},
    { val: 'OR', title:'Oregon'},
    { val: 'PA', title:'Pennsylvania'},
    { val: 'RI', title:'Rhode Island'},
    { val: 'SC', title:'South Carolina'},
    { val: 'SD', title:'South Dakota'},
    { val: 'TN', title:'Tennessee'},
    { val: 'TX', title:'Texas'},
    { val: 'UT', title:'Utah'},
    { val: 'VT', title:'Vermont'},
    { val: 'VA', title:'Virginia'},
    { val: 'WA', title:'Washington'},
    { val: 'WV', title:'West Virginia'},
    { val: 'WI', title:'Wisconsin'},
    { val: 'WY', title:'Wyoming'},
  ];
}
