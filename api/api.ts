import { BasicApi, BasicAppHandler, BasicExternalHandler, Electron } from 'backapijh';
import { AppHandler } from './appHandler/appHandler';
import { ExternalHandler } from './externalHandler/externalHandler';
import { HardwareHandler } from './hardwareHandler/hardwareHandler';
import { WebhookConnector } from 'webhookconnector';

export class Api extends BasicApi {
  private webhookConnector: WebhookConnector;

  constructor() {
    let hardwareHandler = new HardwareHandler();
    // let webhookConnector = new WebhookConnector(process.env.WEEBHOOK_DB, process.env.GIT_REPOSITORY_USER,
    //    process.env.GIT_REPOSITORY, process.env.GIT_URL, process.env.PRODUCTION, process.env.STREAME_MODEL,
    //    process.env.WEEBHOOK_DB_HOST, process.env.WEEBHOOK_DB_PORT);
    super(new AppHandler(hardwareHandler), new ExternalHandler(hardwareHandler));
    // this.webhookConnector = webhookConnector;
    this.webhookConnector.startNgrok();
    this.electron = new Electron(process.env.ELECTRON_TOUCH, process.env.ELECTRON_TOUCH_SIMULATE, process.env.ELECTRON_FRAME,
      process.env.ELECTRON_KIOSK, process.env.ELECTRON_NODE, process.env.ELECTRON_WIDTH, process.env.ELECTRON_HEIGHT,
      process.env.ELECTRON_FULLSCREEN, process.env.ELECTRON_USE_CONTENT_SIZE, process.env.ELECTRON_AUTO_HIDE_MENU_BAR,
      process.env.ELECTRON_TITLE, process.env.ELECTRON_CONSOLE, process.env.ELECTRON_URL, process.env.ELECTRON_ZOOM,
      process.env.ELECTRON_OVERLAY_SCROLLBARS, process.env.ELECTRON_DEVELOPMENT, process.env.ELECTRON_ICON);
  }
}
