import EventEmitter from "node:events";
import GenshinDataExtension from "../extension/GenshinDataExtension";

interface Events {
    "onDataUpdateStart": [];
    "onDataUpdateEnd": [];
    "onDataUpdateError": [error: Error];
}

interface UpdateOptions {
    extensions: GenshinDataExtension[];
}

interface AutoUpdaterOptions extends UpdateOptions {
    instant: boolean;
    interval: number;
}

export type Awaitable<T> = PromiseLike<T> | T;

export default class GenshinDataManager extends EventEmitter {

    private autoUpdater: NodeJS.Timeout | null = null;

    constructor() {
        super();
    }

    public async update(options: UpdateOptions): Promise<void> {
        this.emit("onDataUpdateStart");

        const excelFiles = options.extensions.flatMap((extension) => extension.excelFiles);
        const textMapHashes = options.extensions.flatMap((extension) => extension.textMapHashes);

        // TODO: Implement update logic

        this.emit("onDataUpdateEnd");
    }

    public activateAutoUpdater(options: AutoUpdaterOptions): this {
        if (options.instant) this.update(options);
        this.autoUpdater = setInterval(() => { this.update(options); }, options.interval);
        return this;
    }

    public deactivateAutoUpdater(): this {
        if (this.autoUpdater) clearInterval(this.autoUpdater);
        this.autoUpdater = null;
        return this;
    }

    public on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof Events>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public on(event: string, listener: (...args: any[]) => Awaitable<void>): this {
        return super.on(event, listener);
    }

    public once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof Events>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public once(event: string, listener: (...args: any[]) => Awaitable<void>): this {
        return super.once(event, listener);
    }

    public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof Events>, ...args: unknown[]): boolean;
    public emit(event: string, ...args: unknown[]): boolean {
        return super.emit(event, ...args);
    }

    public off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
        event: Exclude<S, keyof Events>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public off(event: string, listener: (...args: any[]) => Awaitable<void>): this {
        return super.off(event, listener);
    }

    public removeAllListeners<K extends keyof Events>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof Events>): this;
    public removeAllListeners(event?: string): this {
        return super.removeAllListeners(event);
    }
}