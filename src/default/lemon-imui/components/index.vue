<script>
import {
  useScopedSlot,
  funCall,
  generateUUID,
  clearHtmlExcludeImg,
} from "../utils";
import { isFunction, isString, isEmpty } from "../utils/validate";
import contextmenu from "../directives/contextmenu";
import {
  DEFAULT_MENUS,
  DEFAULT_MENU_LASTMESSAGES,
  DEFAULT_MENU_CONTACTS,
} from "../utils/constant";
import lastContentRender from "../lastContentRender";

import MemoryCache from "../utils/cache/memory";

let allMessages = {};
const emojiMap = {};
const toPx = val => {
  return isString(val) ? val : `${val}px`;
};
const toPoint = str => {
  return str.replace("%", "") / 100;
};

let renderDrawerContent = () => {};

export default {
  name: "LemonImui",
  provide() {
    return {
      IMUI: this,
    };
  },
  props: {
    width: {
      type: [String, Number],
      default: 850,
    },
    height: {
      type: [String, Number],
      default: 580,
    },
    theme: {
      type: String,
      default: "default",
    },
    simple: {
      type: Boolean,
      default: false,
    },
    loadingText: [String, Function],
    loadendText: [String, Function],
    /**
     * 消息时间格式化规则
     */
    messageTimeFormat: Function,
    /**
     * 联系人最新消息时间格式化规则
     */
    contactTimeFormat: Function,
    /**
     * 初始化时是否隐藏抽屉
     */
    hideDrawer: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否隐藏导航按钮上的头像
     */
    hideMenuAvatar: Boolean,
    hideMenu: Boolean,
    /**
     * 是否隐藏消息列表内的联系人名字
     */
    hideMessageName: Boolean,
    /**
     * 是否隐藏消息列表内的发送时间
     */
    hideMessageTime: Boolean,
    sendKey: Function,
    wrapKey: Function,
    sendText: String,
    contextmenu: Array,
    contactContextmenu: Array,
    avatarCricle: Boolean,
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    this.CacheContactContainer = new MemoryCache();
    this.CacheMenuContainer = new MemoryCache();
    this.CacheMessageLoaded = new MemoryCache();
    this.CacheDraft = new MemoryCache();
    return {
      drawerVisible: !this.hideDrawer,
      currentContactId: null,
      currentMessages: [],
      activeSidebar: DEFAULT_MENU_LASTMESSAGES,
      contacts: [],
      menus: [],
      editorTools: [
        { name: "emoji" },
        { name: "uploadFile" },
        { name: "uploadImage" },
      ],
    };
  },

  render() {
    return this._renderWrapper([
      this._renderMenu(),
      this._renderSidebarMessage(),
      this._renderSidebarContact(),
      this._renderContainer(),
      this._renderDrawer(),
    ]);
  },
  created() {
    this.initMenus();
  },
  async mounted() {
    await this.$nextTick();
  },
  computed: {
    currentContact() {
      return this.contacts.find(item => item.id == this.currentContactId) || {};
    },
    currentMenu() {
      return this.menus.find(item => item.name == this.activeSidebar) || {};
    },
    currentIsDefSidebar() {
      return DEFAULT_MENUS.includes(this.activeSidebar);
    },
    lastMessages() {
      const data = this.contacts.filter(item => !isEmpty(item.lastContent));
      data.sort((a1, a2) => {
        return a2.lastSendTime - a1.lastSendTime;
      });
      return data;
    },
  },
  watch: {
    activeSidebar() {},
  },
  methods: {
    _menuIsContacts() {
      return this.activeSidebar == DEFAULT_MENU_CONTACTS;
    },
    _menuIsMessages() {
      return this.activeSidebar == DEFAULT_MENU_LASTMESSAGES;
    },
    _createMessage(message) {
      return {
        ...{
          id: generateUUID(),
          type: "text",
          status: "going",
          sendTime: new Date().getTime(),
          toContactId: this.currentContactId,
          fromUser: {
            ...this.user,
          },
        },
        ...message,
      };
    },
    /**
     * 新增一条消息
     */
    appendMessage(message, scrollToBottom = false) {
      let unread = "+1";
      let messageList = allMessages[message.toContactId];
      // 如果是自己的消息需要push，发送的消息不再增加未读条数
      if (message.type == 'event' || this.user.id == message.fromUser.id) unread = "+0";
      if (messageList === undefined) {
        this.updateContact({
          id: message.toContactId,
          unread: unread,
          lastSendTime: message.sendTime,
          lastContent: this.lastContentRender(message),
        });
      } else {
        // 如果消息存在则不再添加
        let hasMsg = messageList.some(({id})=>id == message.id);
        if (hasMsg) return;
        this._addMessage(message, message.toContactId, 1);
        const updateContact = {
          id: message.toContactId,
          lastContent: this.lastContentRender(message),
          lastSendTime: message.sendTime,
        };
        if (message.toContactId == this.currentContactId) {
          if (scrollToBottom == true) {
            this.messageViewToBottom();
          }
          this.CacheDraft.remove(message.toContactId);
        } else {
          updateContact.unread = unread;
        }
        this.updateContact(updateContact);
      }
    },
    _emitSend(message, next, file) {
      this.$emit(
        "send",
        message,
        (replaceMessage = { status: "succeed" }) => {
          next();
          this.updateMessage(Object.assign(message, replaceMessage));
        },
        file,
      );
    },
    _handleSend(text) {
      const message = this._createMessage({ content: text });
      this.appendMessage(message, true);
      this._emitSend(message, () => {
        this.updateContact({
          id: message.toContactId,
          lastContent: this.lastContentRender(message),
          lastSendTime: message.sendTime,
        });
        this.CacheDraft.remove(message.toContactId);
      });
    },
    _handleUpload(file) {
      const imageTypes = ["image/gif", "image/jpeg", "image/png"];
      let joinMessage;
      if (imageTypes.includes(file.type)) {
        joinMessage = {
          type: "image",
          content: URL.createObjectURL(file),
        };
      } else {
        joinMessage = {
          type: "file",
          fileSize: file.size,
          fileName: file.name,
          content: "",
        };
      }
      const message = this._createMessage(joinMessage);
      this.appendMessage(message, true);
      this._emitSend(
        message,
        () => {
          this.updateContact({
            id: message.toContactId,
            lastContent: this.lastContentRender(message),
            lastSendTime: message.sendTime,
          });
        },
        file,
      );
    },
    _emitPullMessages(next) {
      this._changeContactLock = true;
      this.$emit(
        "pull-messages",
        this.currentContact,
        (messages = [], isEnd = false) => {
          this._addMessage(messages, this.currentContactId, 0);
          this.CacheMessageLoaded.set(this.currentContactId, isEnd);
          if (isEnd == true) this.$refs.messages.loaded();
          this.updateCurrentMessages();
          this._changeContactLock = false;
          next(isEnd);
        },
        this,
      );
    },
    clearCacheContainer(name) {
      this.CacheContactContainer.remove(name);
      this.CacheMenuContainer.remove(name);
    },
    _renderWrapper(children) {
      return (
        <div
          style={{
            width: toPx(this.width),
            height: toPx(this.height),
          }}
          ref="wrapper"
          class={[
            "lemon-wrapper",
            `lemon-wrapper--theme-${this.theme}`,
            { "lemon-wrapper--simple": this.simple },
            this.drawerVisible && "lemon-wrapper--drawer-show",
          ]}
        >
          {children}
        </div>
      );
    },
    _renderMenu() {
      const menuItem = this._renderMenuItem();
      return (
        <div class="lemon-menu" v-show={!this.hideMenu}>
          {
            <lemon-avatar
              v-show={!this.hideMenuAvatar}
              on-click={e => {
                this.$emit("menu-avatar-click", e);
              }}
              class="lemon-menu__avatar"
              src={this.user.avatar}
            />
          }
          {menuItem.top}
          {this.$slots.menu}
          <div class="lemon-menu__bottom">
            {this.$slots["menu-bottom"]}
            {menuItem.bottom}
          </div>
        </div>
      );
    },
    _renderMenuAvatar() {
      return;
    },
    _renderMenuItem() {
      const top = [];
      const bottom = [];
      this.menus.forEach(item => {
        const { name, title, unread, render, click } = item;
        const node = (
          <div
            class={[
              "lemon-menu__item",
              { "lemon-menu__item--active": this.activeSidebar == name },
            ]}
            on-click={() => {
              funCall(click, () => {
                if (name) this.changeMenu(name);
              });
            }}
            title={title}
          >
            <lemon-badge count={unread}>{render(item)}</lemon-badge>
          </div>
        );
        item.isBottom === true ? bottom.push(node) : top.push(node);
      });
      return {
        top,
        bottom,
      };
    },
    _renderSidebarMessage() {
      return this._renderSidebar(
        [
          useScopedSlot(this.$scopedSlots["sidebar-message-top"], null, this),
          this.lastMessages.map(contact => {
            return this._renderContact(
              {
                contact,
                timeFormat: this.contactTimeFormat,
              },
              () => this.changeContact(contact.id),
              this.$scopedSlots["sidebar-message"],
            );
          }),
        ],
        DEFAULT_MENU_LASTMESSAGES,
        useScopedSlot(
          this.$scopedSlots["sidebar-message-fixedtop"],
          null,
          this,
        ),
      );
    },
    _renderContact(props, onClick, slot) {
      const {
        click: customClick,
        renderContainer,
        id: contactId,
      } = props.contact;
      const click = () => {
        funCall(customClick, () => {
          onClick();
          this._customContainerReady(
            renderContainer,
            this.CacheContactContainer,
            contactId,
          );
        });
      };

      return (
        <lemon-contact
          class={{
            "lemon-contact--active": this.currentContactId == props.contact.id,
          }}
          v-lemon-contextmenu_contact={this.contactContextmenu}
          props={props}
          on-click={click}
          scopedSlots={{ default: slot }}
        />
      );
    },
    _renderSidebarContact() {
      let prevIndex;
      return this._renderSidebar(
        [
          useScopedSlot(this.$scopedSlots["sidebar-contact-top"], null, this),
          this.contacts.map(contact => {
            if (!contact.index) return;
            contact.index = contact.index.replace(/\[[0-9]*\]/, "");
            const node = [
              contact.index !== prevIndex && (
                <p class="lemon-sidebar__label">{contact.index}</p>
              ),
              this._renderContact(
                {
                  contact: contact,
                  simple: true,
                },
                () => {
                  this.changeContact(contact.id);
                },
                this.$scopedSlots["sidebar-contact"],
              ),
            ];
            prevIndex = contact.index;
            return node;
          }),
        ],
        DEFAULT_MENU_CONTACTS,
        useScopedSlot(
          this.$scopedSlots["sidebar-contact-fixedtop"],
          null,
          this,
        ),
      );
    },
    _renderSidebar(children, name, fixedtop) {
      return (
        <div
          class="lemon-sidebar"
          v-show={this.activeSidebar == name}
          on-scroll={this._handleSidebarScroll}
        >
          <div class="lemon-sidebar__fixed-top">{fixedtop}</div>
          <div class="lemon-sidebar__scroll">{children}</div>
        </div>
      );
    },
    _renderDrawer() {
      return this._menuIsMessages() && this.currentContactId ? (
        <div class="lemon-drawer" ref="drawer">
          {renderDrawerContent(this.currentContact)}
          {useScopedSlot(this.$scopedSlots.drawer, "", this.currentContact)}
        </div>
      ) : (
        ""
      );
    },
    _isContactContainerCache(name) {
      return name.startsWith("contact#");
    },
    _renderContainer() {
      const nodes = [];
      const cls = "lemon-container";
      const curact = this.currentContact;
      let defIsShow = true;
      for (const name in this.CacheContactContainer.get()) {
        const show = curact.id == name && this.currentIsDefSidebar;
        defIsShow = !show;
        nodes.push(
          <div class={cls} v-show={show}>
            {this.CacheContactContainer.get(name)}
          </div>,
        );
      }
      for (const name in this.CacheMenuContainer.get()) {
        nodes.push(
          <div
            class={cls}
            v-show={this.activeSidebar == name && !this.currentIsDefSidebar}
          >
            {this.CacheMenuContainer.get(name)}
          </div>,
        );
      }

      nodes.push(
        <div
          class={cls}
          v-show={this._menuIsMessages() && defIsShow && curact.id}
        >
          <div class="lemon-container__title">
            {useScopedSlot(
              this.$scopedSlots["message-title"],
              <div class="lemon-container__displayname">
                {curact.displayName}
              </div>,
              curact,
            )}
          </div>
          <div class="lemon-vessel">
            <div class="lemon-vessel__left">
              <lemon-messages
                ref="messages"
                loading-text={this.loadingText}
                loadend-text={this.loadendText}
                hide-time={this.hideMessageTime}
                hide-name={this.hideMessageName}
                time-format={this.messageTimeFormat}
                reverse-user-id={this.user.id}
                on-reach-top={this._emitPullMessages}
                messages={this.currentMessages}
              />
              <lemon-editor
                ref="editor"
                tools={this.editorTools}
                sendText={this.sendText}
                sendKey={this.sendKey}
                wrapKey={this.wrapKey}
                onSend={this._handleSend}
                onUpload={this._handleUpload}
              />
            </div>
            <div class="lemon-vessel__right">
              {useScopedSlot(this.$scopedSlots["message-side"], null, curact)}
            </div>
          </div>
        </div>,
      );
      nodes.push(
        <div class={cls} v-show={!curact.id && this.currentIsDefSidebar}>
          {this.$slots.cover}
        </div>,
      );
      nodes.push(
        <div
          class={cls}
          v-show={this._menuIsContacts() && defIsShow && curact.id}
        >
          {useScopedSlot(
            this.$scopedSlots["contact-info"],
            <div class="lemon-contact-info">
              <lemon-avatar src={curact.avatar} size={90} />
              <h4>{curact.displayName}</h4>
              <lemon-button
                on-click={() => {
                  if (isEmpty(curact.lastContent)) {
                    this.updateContact({
                      id: curact.id,
                      lastContent: " ",
                    });
                  }
                  this.$emit('contact-send', curact)
                  this.changeContact(curact.id, DEFAULT_MENU_LASTMESSAGES);
                }}
              >
                发送消息
              </lemon-button>
            </div>,
            curact,
          )}
        </div>,
      );
      return nodes;
    },
    _handleSidebarScroll() {
      contextmenu.hide();
    },
    _addContact(data, t) {
      const type = {
        0: "unshift",
        1: "push",
      }[t];
      this.contacts[type](data);
    },
    _addMessage(data, contactId, t) {
      const type = {
        0: "unshift",
        1: "push",
      }[t];
      if (!Array.isArray(data)) data = [data];
      allMessages[contactId] = allMessages[contactId] || [];
      allMessages[contactId][type](...data);
    },
    /**
     * 设置最新消息DOM
     * @param {String} messageType 消息类型
     * @param {Function} render 返回消息 vnode
     */
    setLastContentRender(messageType, render) {
      lastContentRender[messageType] = render;
    },
    lastContentRender(message) {
      if (!isFunction(lastContentRender[message.type])) {
        console.error(
          `not found '${
            message.type
          }' of the latest message renderer,try to use ‘setLastContentRender()’`,
        );
        return "";
      }
      return lastContentRender[message.type].call(this, message);
    },
    /**
     * 将字符串内的 EmojiItem.name 替换为 img
     * @param {String} str 被替换的字符串
     * @return {String} 替换后的字符串
     */
    emojiNameToImage(str) {
      return str.replace(/\[([\u4E00-\u9FFF]+|\w+)\]/gi, (str, match) => {
        const file = match;
        return emojiMap[file]
          ? `<img emoji-name="${match}" src="${emojiMap[file]}" />`
          : `[${match}]`;
        // : `[!${match}]`;
      });
    },
    emojiImageToName(str) {
      return str.replace(/<img emoji-name=\"([^\"]*?)\" [^>]*>/gi, "[$1]");
    },
    updateCurrentMessages() {
      if (!allMessages[this.currentContactId])
        allMessages[this.currentContactId] = [];
      this.currentMessages = allMessages[this.currentContactId];
    },
    /**
     * 将当前聊天窗口滚动到底部
     */
    messageViewToBottom() {
      this.$refs.messages.scrollToBottom();
    },
    /**
     * 设置联系人的草稿信息
     */
    setDraft(cid, editorValue) {
      if (isEmpty(cid) || isEmpty(editorValue)) return false;
      const contact = this.findContact(cid);
      let lastContent = contact.lastContent;
      if (isEmpty(contact)) return false;
      if (this.CacheDraft.has(cid)) {
        lastContent = this.CacheDraft.get(cid).lastContent;
      }
      this.CacheDraft.set(cid, {
        editorValue,
        lastContent,
      });
      this.updateContact({
        id: cid,
        lastContent: `<span style="color:red;">[草稿]</span><span>${this.lastContentRender(
          { type: "text", content: editorValue },
        )}</span>`,
      });
    },
    /**
     * 清空联系人草稿信息
     */
    clearDraft(contactId) {
      const draft = this.CacheDraft.get(contactId);
      if (draft) {
        const currentContent = this.findContact(contactId).lastContent;
        if (
          currentContent.indexOf('<span style="color:red;">[草稿]</span>') === 0
        ) {
          this.updateContact({
            id: contactId,
            lastContent: draft.lastContent,
          });
        }
        this.CacheDraft.remove(contactId);
      }
    },
    /**
     * 改变聊天对象
     * @param contactId 联系人 id
     */
    async changeContact(contactId, menuName) {
      if (menuName) {
        this.changeMenu(menuName);
      } else {
        if (this._changeContactLock || this.currentContactId == contactId)
          return false;
      }

      //保存上个聊天目标的草稿
      if (this.currentContactId) {
        const editorValue = clearHtmlExcludeImg(this.getEditorValue()).trim();
        if (editorValue) {
          this.setDraft(this.currentContactId, editorValue);
          this.setEditorValue();
        } else {
          this.clearDraft(this.currentContactId);
        }
      }

      this.currentContactId = contactId;
      if (!this.currentContactId) return false;

      this.$emit("change-contact", this.currentContact, this);
      if (
        isFunction(this.currentContact.renderContainer) ||
        this.activeSidebar == DEFAULT_MENU_CONTACTS
      ) {
        return;
      }
      //填充草稿内容
      const draft = this.CacheDraft.get(contactId);
      if (draft) this.setEditorValue(draft.editorValue);

      if (this.CacheMessageLoaded.has(contactId)) {
        this.$refs.messages.loaded();
      } else {
        this.$refs.messages.resetLoadState();
      }

      if (!allMessages[contactId]) {
        this.updateCurrentMessages();
        this._emitPullMessages(isEnd => {
          this.messageViewToBottom();
        });
      } else {
        setTimeout(() => {
          this.updateCurrentMessages();
          this.messageViewToBottom();
        }, 0);
      }
    },
    /**
     * 删除一条聊天消息
     * @param messageId 消息 id
     * @param contactId 联系人 id
     */
    removeMessage(messageId) {
      const message = this.findMessage(messageId);
      if (!message) return false;
      const index = allMessages[message.toContactId].findIndex(
        ({ id }) => id == messageId,
      );
      allMessages[message.toContactId].splice(index, 1);
      return true;
    },
    /**
     * 修改聊天一条聊天消息
     * @param {Message} data 根据 data.id 查找聊天消息并覆盖传入的值
     * @param contactId 联系人 id
     */
    updateMessage(message) {
      if (!message.id) return false;
      let historyMessage = this.findMessage(message.id);
      if (!historyMessage) return false;
      historyMessage = Object.assign(historyMessage, message, {
        toContactId: historyMessage.toContactId,
      });
      return true;
    },
    /**
     * 手动更新对话消息
     * @param {String} messageId 消息ID，如果为空则更新当前聊天窗口的所有消息
     */
    forceUpdateMessage(messageId) {
      if (!messageId) {
        this.$refs.messages.$forceUpdate();
      } else {
        const components = this.$refs.messages.$refs.message;
        if (components) {
          const messageComponent = components.find(
            com => com.$attrs.message.id == messageId,
          );
          if (messageComponent) messageComponent.$forceUpdate();
        }
      }
    },
    _customContainerReady(render, cacheDrive, key) {
      if (isFunction(render) && !cacheDrive.has(key)) {
        cacheDrive.set(key, render.call(this));
      }
    },
    /**
     * 切换左侧按钮
     * @param {String} name 按钮 name
     */
    changeMenu(name) {
      this.$emit("change-menu", name);
      this.activeSidebar = name;
    },
    /**
     * 初始化编辑框的 Emoji 表情列表，是 Lemon-editor.initEmoji 的代理方法
     * @param {Array<Emoji,EmojiItem>} data emoji 数据
     * Emoji = {label: 表情,children: [{name: wx,title: 微笑,src: url}]} 分组
     * EmojiItem = {name: wx,title: 微笑,src: url} 无分组
     */
    initEmoji(data) {
      let flatData = [];
      this.$refs.editor.initEmoji(data);
      if (data[0].label) {
        data.forEach(item => {
          flatData.push(...item.children);
        });
      } else {
        flatData = data;
      }
      flatData.forEach(({ name, src }) => (emojiMap[name] = src));
    },
    initEditorTools(data) {
      //this.editorTools = data;
      this.editorTools = data;
      //this.$refs.editor.initTools(data);
    },
    /**
     * 初始化左侧按钮
     * @param {Array<Menu>} data 按钮数据
     */
    initMenus(data) {
      const defaultMenus = [
        {
          name: DEFAULT_MENU_LASTMESSAGES,
          title: "聊天",
          unread: 0,
          click: null,
          render: menu => {
            return <i class="lemon-icon-message" />;
          },
          isBottom: false,
        },
        {
          name: DEFAULT_MENU_CONTACTS,
          title: "通讯录",
          unread: 0,
          click: null,
          render: menu => {
            return <i class="lemon-icon-addressbook" />;
          },
          isBottom: false,
        },
      ];
      let menus = [];
      if (Array.isArray(data)) {
        const indexMap = {
          messages: 0,
          contacts: 1,
        };
        const indexKeys = Object.keys(indexMap);
        menus = data.map(item => {
          if (indexKeys.includes(item.name)) {
            return {
              ...defaultMenus[indexMap[item.name]],
              ...item,
              ...{ renderContainer: null },
            };
          }

          if (item.renderContainer) {
            this._customContainerReady(
              item.renderContainer,
              this.CacheMenuContainer,
              item.name,
            );
          }

          return item;
        });
      } else {
        menus = defaultMenus;
      }

      this.menus = menus;
    },
    /**
     * 初始化联系人数据
     * @param {Array<Contact>} data 联系人列表
     */
    initContacts(data) {
      this.contacts = data;
      // 处理系统通知联系人
      let admin = this.contacts.find(item=>item.id==='C2Cadministrator') 
      if(admin){
        admin.displayName = '系统通知'
        admin.avatar = 'data:image/png;base64,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'
      }
      // 处理AI问答
      let RBT = this.contacts.find(item=>item.id.includes("@RBT")) 
      if(RBT){
        RBT.displayName = 'AI问答'
        RBT.avatar = 'data:image/png;base64,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'
      }

      this.sortContacts();
    },
    /**
     * 使用 联系人的 index 值进行排序
     */
    sortContacts() {
      this.contacts.sort((a, b) => {
        if (!a.index) return;
        return a.index.localeCompare(b.index);
      });
    },
    appendContact(contact) {
      if (isEmpty(contact.id) || isEmpty(contact.displayName)) {
        console.error("id | displayName cant be empty");
        return false;
      }
      if (this.hasContact(contact.id)) return true;
      this.contacts.push(
        Object.assign(
          {
            id: "",
            displayName: "",
            avatar: "",
            index: "",
            unread: 0,
            lastSendTime: "",
            lastContent: "",
          },
          contact,
        ),
      );
      return true;
    },
    removeContact(id) {
      const index = this.findContactIndexById(id);
      if (index === -1) return false;
      this.contacts.splice(index, 1);
      this.CacheDraft.remove(id);
      this.CacheMessageLoaded.remove(id);
      return true;
    },
    /**
     * 修改联系人数据
     * @param {Contact} data 修改的数据，根据 Contact.id 查找联系人并覆盖传入的值
     */
    updateContact(data) {
      const contactId = data.id;
      delete data.id;

      const index = this.findContactIndexById(contactId);
      if (index !== -1) {
        const { unread } = data;
        if (isString(unread)) {
          if (unread.indexOf("+") === 0 || unread.indexOf("-") === 0) {
            data.unread =
              parseInt(unread) + parseInt(this.contacts[index].unread);
          }
        }
        this.$set(this.contacts, index, {
          ...this.contacts[index],
          ...data,
        });
      }
    },
    /**
     * 根据 id 查找联系人的索引
     * @param contactId 联系人 id
     * @return {Number} 联系人索引，未找到返回 -1
     */
    findContactIndexById(contactId) {
      return this.contacts.findIndex(item => item.id == contactId);
    },
    /**
     * 根据 id 查找判断是否存在联系人
     * @param contactId 联系人 id
     * @return {Boolean}
     */
    hasContact(contactId) {
      return this.findContactIndexById(contactId) !== -1;
    },
    findMessage(messageId) {
      for (const key in allMessages) {
        const message = allMessages[key].find(({ id }) => id == messageId);
        if (message) return message;
      }
    },
    findContact(contactId) {
      return this.getContacts().find(({ id }) => id == contactId);
    },
    /**
     * 返回所有联系人
     * @return {Array<Contact>}
     */
    getContacts() {
      return this.contacts;
    },
    //返回当前聊天窗口联系人信息
    getCurrentContact() {
      return this.currentContact;
    },
    getCurrentMessages() {
      return this.currentMessages;
    },
    setEditorValue(val = "") {
      if (!isString(val)) return false;
      this.$refs.editor.setValue(this.emojiNameToImage(val));
    },
    getEditorValue() {
      return this.$refs.editor.getFormatValue();
    },
    /**
     * 清空某个联系人的消息，切换到该联系人时会重新触发pull-messages事件
     */
    clearMessages(contactId) {
      if (contactId) {
        delete allMessages[contactId];
        this.CacheMessageLoaded.remove(contactId);
        // 不清空草稿
        // this.CacheDraft.remove(contactId);
      } else {
        allMessages = {};
        this.CacheMessageLoaded.remove();
        // this.CacheDraft.remove();
      }
      return true;
    },
    /**
     * 返回所有消息
     * @return {Object<Contact.id,Message>}
     */
    getMessages(contactId) {
      return (contactId ? allMessages[contactId] : allMessages) || [];
    },
    changeDrawer(params) {
      this.drawerVisible = !this.drawerVisible;
      if (this.drawerVisible == true) this.openDrawer(params);
    },
    // openDrawer(data) {
    //   renderDrawerContent = data || new Function();
    //   this.drawerVisible = true;
    // },
    openDrawer(params) {
      renderDrawerContent = isFunction(params)
        ? params
        : params.render || new Function();
      const wrapperWidth = this.$refs.wrapper.clientWidth;
      const wrapperHeight = this.$refs.wrapper.clientHeight;
      let width = params.width || 200;
      let height = params.height || wrapperHeight;
      let offsetX = params.offsetX || 0;
      let offsetY = params.offsetY || 0;
      const position = params.position || "right";
      if (isString(width)) width = wrapperWidth * toPoint(width);
      if (isString(height)) height = wrapperHeight * toPoint(height);
      if (isString(offsetX)) offsetX = wrapperWidth * toPoint(offsetX);
      if (isString(offsetY)) offsetY = wrapperHeight * toPoint(offsetY);

      this.$refs.drawer.style.width = `${width}px`;
      this.$refs.drawer.style.height = `${height}px`;

      let left = 0;
      let top = 0;
      let shadow = "";
      if (position == "right") {
        left = wrapperWidth;
      } else if (position == "rightInside") {
        left = wrapperWidth - width;
        shadow = `-15px 0 16px -14px rgba(0,0,0,0.08)`;
      } else if (position == "center") {
        left = wrapperWidth / 2 - width / 2;
        top = wrapperHeight / 2 - height / 2;
        shadow = `0 0 20px rgba(0,0,0,0.08)`;
      }
      left += offsetX;
      top += offsetY + -1;
      this.$refs.drawer.style.top = `${top}px`;
      this.$refs.drawer.style.left = `${left}px`;
      this.$refs.drawer.style.boxShadow = shadow;

      this.drawerVisible = true;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
  },
};
</script>
<style lang="stylus">
bezier = cubic-bezier(0.645, 0.045, 0.355, 1)
@import '../styles/utils/index'

+b(lemon-wrapper)
  display flex
  font-size 14px
  font-family "Microsoft YaHei"
  //mask-image radial-gradient(circle, white 100%, black 100%)
  background #efefef
  transition all .4s bezier
  position relative
  p
    margin 0
  img
    vertical-align middle
    border-style none
+b(lemon-menu)
  flex-column()
  align-items center
  width 60px
  background #1d232a
  padding 15px 0
  position relative
  user-select none
  +e(bottom)
    flex-column()
    position absolute
    bottom 0
  +e(avatar)
    margin-bottom 20px
    cursor pointer
  +e(item)
    color #999
    cursor pointer
    padding 14px 10px
    max-width 100%
    +m(active)
      color #0fd547
    &:hover:not(.lemon-menu__item--active)
      color #eee
    word-break()
    > *
      font-size 24px
    .ant-badge-count
      display inline-block
      padding 0 4px
      height 18px
      line-height 16px
      min-width 18px
    .ant-badge-count
    .ant-badge-dot
      box-shadow 0 0 0 1px #1d232a
+b(lemon-sidebar)
  width 250px
  background #efefef
  border-right 1px solid #ccc
  display flex
  flex-direction column
  +e(scroll)
    overflow-y auto
    scrollbar-light()
  +e(label)
    padding 6px 14px 6px 14px
    color #666
    font-size 12px
    margin 0
    text-align left
  +b(lemon-contact--active)
    background #d9d9d9
+b(lemon-container)
  flex 1
  flex-column()
  background #f4f4f4
  word-break()
  position relative
  z-index 10
  +e(title)
    padding 15px 15px
    background #ededed
  +e(displayname)
    font-size 16px
+b(lemon-vessel)
  display flex
  flex 1
  min-height 100px
  +e(left)
    display flex
    flex-direction column
    flex 1
  +e(right)
    flex none
+b(lemon-messages)
  flex 1
  height auto
+b(lemon-drawer)
  position absolute
  top 0
  overflow hidden
  background #f6f6f6
  z-index 11
  display none
+b(lemon-wrapper)
  +m(drawer-show)
    +b(lemon-drawer)
      display block
+b(lemon-contact-info)
  flex-column()
  justify-content center
  align-items center
  height 100%
  h4
    font-size 16px
    font-weight normal
    margin 10px 0 20px 0
    user-select none
.lemon-wrapper--theme-blue
  .lemon-message__content
    background #f3f3f3
    &::before
      border-right-color #f3f3f3
  .lemon-message--reverse .lemon-message__content
    background #e6eeff
    &::before
      border-left-color #e6eeff
  .lemon-container
    background #fff
  .lemon-sidebar
    background #f9f9f9
    .lemon-contact
      background #f9f9f9
      &:hover:not(.lemon-contact--active)
        background #f1f1f1
      &--active
        background #e9e9e9
  .lemon-menu
    background #096bff
  .lemon-menu__item
    color rgba(255,255,255,0.4)
    &:hover:not(.lemon-menu__item--active)
      color rgba(255,255,255,0.6)
    &--active
      color #fff
      text-shadow 0 0 10px rgba(2,48,118,0.4)
.lemon-wrapper--simple
  .lemon-menu
  .lemon-sidebar
    display none
.lemon-wrapper--simple
  .lemon-menu
  .lemon-sidebar
    display none
+b(lemon-contextmenu)
  border-radius 4px
  font-size 14px
  font-variant tabular-nums
  line-height 1.5
  color rgba(0, 0, 0, 0.65)
  z-index 9999
  background-color #fff
  border-radius 6px
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.06)
  position absolute
  transform-origin 50% 150%
  box-sizing border-box
  user-select none
  overflow hidden
  min-width 120px
  +e(item)
    font-size 14px
    line-height 16px
    padding 10px 15px
    cursor pointer
    display flex
    align-items center
    color #333
    > span
      display inline-block
      flex none
      //max-width 100px
      ellipsis()
    &:hover
      background #f3f3f3
      color #000
    &:active
      background #e9e9e9
  +e(icon)
    font-size 16px
    margin-right 4px
</style>
