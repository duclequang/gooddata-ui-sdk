// (C) 2019-2020 GoodData Corporation
import {
    IWorkspaceSettings,
    IWorkspaceSettingsService,
    IUserWorkspaceSettings,
} from "@gooddata/sdk-backend-spi";
import { BearAuthenticatedCallGuard } from "../../../types/auth";
import { userLoginMd5FromAuthenticatedPrincipal } from "../../../utils/api";

export class BearWorkspaceSettings implements IWorkspaceSettingsService {
    constructor(private readonly authCall: BearAuthenticatedCallGuard, public readonly workspace: string) {}

    public getSettings(): Promise<IWorkspaceSettings> {
        return this.authCall(async (sdk) => {
            const flags = await sdk.project.getProjectFeatureFlags(this.workspace);

            return {
                workspace: this.workspace,
                ...flags,
            };
        });
    }

    public getSettingsForCurrentUser(): Promise<IUserWorkspaceSettings> {
        return this.authCall(async (sdk, { getPrincipal }) => {
            const userLoginMd5 = await userLoginMd5FromAuthenticatedPrincipal(getPrincipal);

            const [workspaceFeatureFlags, userFeatureFlags, currentProfile] = await Promise.all([
                sdk.project.getProjectFeatureFlags(this.workspace),
                // the getUserFeatureFlags returns all the feature flags (including the defaults)
                // so we have to filter only the user specific values so as not to use defaults everywhere
                sdk.user.getUserFeatureFlags(userLoginMd5, ["user"]),
                sdk.user.getCurrentProfile(),
            ]);

            const { language } = currentProfile;

            return {
                userId: userLoginMd5,
                workspace: this.workspace,
                locale: language!,
                // the order is important here, user configs with the "user" source should override the workspace settings
                ...workspaceFeatureFlags,
                ...userFeatureFlags,
            };
        });
    }
}
