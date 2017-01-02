import { SwayPage } from './app.po';

describe('sway App', function() {
  let page: SwayPage;

  beforeEach(() => {
    page = new SwayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
