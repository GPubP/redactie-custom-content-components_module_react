import { ContentTypeAPI } from '@redactie/content-types-module';
import Core from '@redactie/redactie-core';

class ContentTypesConnector {
	public static apiName = 'content-type-module';
	public api: ContentTypeAPI;

	public get fieldTypesFacade(): ContentTypeAPI['store']['fieldTypes']['facade'] {
		return this.api.store.fieldTypes.facade;
	}

	public get presetsFacade(): ContentTypeAPI['store']['presets']['facade'] {
		return this.api.store.presets.facade;
	}

	public get hooks(): ContentTypeAPI['hooks'] {
		return this.api.hooks;
	}

	public get views(): ContentTypeAPI['views'] {
		return this.api.views;
	}

	public get helpers(): ContentTypeAPI['helpers'] {
		return this.api.helpers;
	}

	constructor(api?: ContentTypeAPI) {
		if (!api) {
			throw new Error(
				`Custom content components module:
				Dependencies not found: ${ContentTypesConnector.apiName}`
			);
		}
		this.api = api;
	}
}

const contentTypesConnector = new ContentTypesConnector(
	Core.modules.getModuleAPI<ContentTypeAPI>(ContentTypesConnector.apiName)
);

export default contentTypesConnector;
