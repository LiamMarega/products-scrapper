import { Asset } from '../../../entity/asset/asset.entity';
import { Tag } from '../../../entity/tag/tag.entity';
import { TagService } from '../../../service/services/tag.service';
import { RequestContext } from '../../common/request-context';
export declare class AssetEntityResolver {
    private tagService;
    constructor(tagService: TagService);
    tags(ctx: RequestContext, asset: Asset): Promise<Tag[]>;
}
