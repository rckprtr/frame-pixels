import { NextRequest, NextResponse } from 'next/server';
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { State, User, getMap, getUser } from '../../lib';


const HUB_URL = process.env['HUB_URL'] || "nemes.farcaster.xyz:2283"
const client = getSSLHubRpcClient(HUB_URL);
const BASE_URL = process.env['BASE_URL'] || "https://frame-pixels-6dnm.vercel.app";


async function getResponse(req: NextRequest): Promise<NextResponse> {

  const route = req.nextUrl.searchParams.get('route');
  const body = await req.json()

  let payload = body.untrustedData;

  let fid = payload.fid;
  let buttonIndex = payload.buttonIndex;

  let user: User = await getUser(fid);

  let state = new State(user, await getMap());

  let frameUI = setup();
  frameUI.setRoute(route || 'start');
  let loadedPage = frameUI.currentPage;

  if (loadedPage && route != 'start') {
    loadedPage.clickButton(buttonIndex, state);
  }

  let currentPage = frameUI.currentPage;
  //currentTime Stmap
  let currentTime = new Date().getTime();

  if (currentPage) {
    return new NextResponse(`<!DOCTYPE html><html><head>
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${BASE_URL}/api/image?cache=${currentTime}&fid=${fid}" />
    ${currentPage.rendertMetaTags(state)}
  </head></html>`);
  } else {
    return new NextResponse(JSON.stringify({ message: `error in route` }), { status: 400 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

function setup(): FrameUI {
  let frameUI = new FrameUI();

  let startPage = new FramePage('start');
  startPage.addButton(new RouteButton(1, 'start', 'home'));

  frameUI.addPage(startPage);

  let homePage = new FramePage('home');
  homePage.addButton(new RouteButton(1, 'move', 'coords'))
    .addButton(new RouteButton(2, 'paint', 'paint'));

  frameUI.addPage(homePage);

  let coordsPage = new FramePage('coords');

  coordsPage.addButton(new FrameButton(1, '↖️', (page: FramePage, state: State) => {

    let user = state.user;
    let coords = user.settings.coords;
    let x = coords.x - 1;
    let y = coords.y - 1;

    if(x <= 0){
      x = 0;
    }

    if(y <= 0){
      y = 0;
    }
    user.setCoords(x, y);
  }))
    .addButton(new FrameButton(2, '➡️', (page: FramePage, state: State) => {

      //check if out of bounds
      let user = state.user;
      let map = state.map;
      let coords = user.settings.coords;
      let x = coords.x;
      let y = coords.y;
    
      if(!map.isOutOfBounds(x+1, y)){
        user.moveRight();
      }
    }))
    .addButton(new FrameButton(3, '⬇️', (page: FramePage, state: State) => {

      let user = state.user;
      let map = state.map;
      let coords = user.settings.coords;
      let x = coords.x;
      let y = coords.y;

      if(!map.isOutOfBounds(x, y+1)){
        user.moveDown();
      }
    }))
    .addButton(new RouteButton(4, '🏠', 'home'));

  frameUI.addPage(coordsPage);

  let paintPage = new FramePage('paint');
  paintPage.addButton(new ColorPickerButton(1, '🟪', (page: FramePage, state: State) => {
    state.user.setColor(1);
    state.user.save();
  }))
    .addButton(new ColorPickerButton(2, '⬜', (page: FramePage, state: State) => {
      state.user.setColor(2);
    }))
    .addButton(new FrameButton(3, '🖌️', (page: FramePage, state: State) => {
      let user = state.user;
      state.map.setPixel(user.settings.coords.x, user.settings.coords.y, user.settings.color);
      state.map.save();
    }))
    .addButton(new RouteButton(4, '🏠', 'home'));

  frameUI.addPage(paintPage);

  return frameUI;
}

class FrameUI {

  public routes: FrameRoute[] = [];
  public currentPage: FramePage | undefined;
  constructor() {

  }

  addPage(page: FramePage): FrameUI {
    page.frameUI = this;
    this.routes.push(new FrameRoute(page));
    return this;
  }

  addRoute(route: FrameRoute): FrameUI {
    this.routes.push(route);
    return this;
  }

  getRoute(path: string): FrameRoute | undefined {
    return this.routes.find(route => route.path === path);
  }

  setRoute(path: string): FrameUI {
    let route = this.getRoute(path);
    if (route) {
      this.currentPage = route.page;
    }
    return this;
  }

  getPage(path: string): FramePage | undefined {
    let route = this.getRoute(path);
    if (route) {
      return route.page;
    }
    return undefined;
  }

  clickButton(route: string, buttonId: number, payload: any = {}) {
    let page = this.getPage(route);
    if (page) {
      page.clickButton(buttonId, payload);
    }
  }
}

class FrameRoute {
  public path: string;
  public page: FramePage;

  constructor(page: FramePage) {
    this.page = page;
    this.path = page.path;
  }
}

class FramePage {

  public buttons: FrameButton[] = [];
  public path: string;
  public frameUI: FrameUI | undefined;

  constructor(path: string) {
    this.path = path;
  }

  rendertMetaTags(state: State) {
    let metaTags = this.buttons.map(button => button.rendertMetaTags(state));
    metaTags.push(`<meta name="fc:frame:post_url" content="${BASE_URL}/api/frame?route=${this.path}" />`);
    return metaTags.join('\n');
  }

  addButton(button: FrameButton): FramePage {
    this.buttons.push(button);
    return this;
  }

  clickButton(buttonId: number, state: State) {
    let button = this.buttons.find(button => button.id === buttonId);
    button?.onClick?.(this, state);
    return this;
  }
}

interface OnClickHandler {
  (page: FramePage, state: State): void;
}

class FrameButton {

  public id: number;
  public label: string;
  public onClick: OnClickHandler | undefined;

  constructor(id: number, label: string, onClick?: OnClickHandler) {
    this.id = id;
    this.label = label;
    this.onClick = onClick;
  }

  rendertMetaTags(state: State) {
    return `<meta name="fc:frame:button:${this.id}" content="${this.label}" />`;
  }
}

class ColorPickerButton extends FrameButton {
  constructor(id: number, label: string, onClick?: OnClickHandler) {
    super(id, label, onClick);
  }

  rendertMetaTags(state: State) {
    let color = state.user.settings.color;
    let label = this.label;

    if(this.label === '🟪' && color === 1){
      label = '* 🟪';
    }
    if(this.label === '⬜' && color === 2){
      label = '* ⬜';
    }
    return `<meta name="fc:frame:button:${this.id}" content="${label}" />`;
  }
}

class RouteButton extends FrameButton {
  public route: string;
  constructor(id: number, label: string, route: string) {
    super(id, label, (page: FramePage, state: State) => {

      let frameUI = page.frameUI;
      if (frameUI) {
        frameUI.currentPage = frameUI.getPage(this.route);
      }
    });

    this.route = route;
  }
}
