import { injectable } from 'smart-factory';
import { ExtApiModules } from './modules';
import { ConfigModules, ConfigTypes } from '../configs';
import { ExtApiTypes } from './types';

injectable(ExtApiModules.RequestMyRooms,
  [ ExtApiModules.Requestor,
    ConfigModules.ExtApiConfig ],
  async (request: ExtApiTypes.Request,
    cfg: ConfigTypes.ExternalApiConfig): Promise<ExtApiTypes.RequestMyRooms> =>

    async (memberToken) => {
      const uri = `${cfg.roomBaseUri}/internal/${memberToken}/my`;
      const resp: any[] = await request({
        uri,
        method: ExtApiTypes.RequestMethod.GET
      });
      return resp;
    });