import component from './ph-PH/component';
import globalHeader from './ph-PH/globalHeader';
import menu from './ph-PH/menu';
import pages from './ph-PH/pages';
import pwa from './ph-PH/pwa';
import settingDrawer from './ph-PH/settingDrawer';
import settings from './ph-PH/settings';
export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'CUMAHIG GROUP',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
