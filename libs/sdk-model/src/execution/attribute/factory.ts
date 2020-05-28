// (C) 2019-2020 GoodData Corporation
import identity = require("lodash/identity");
import cloneDeep = require("lodash/cloneDeep");
import isEmpty = require("lodash/isEmpty");
import { IAttribute, isAttribute } from "./index";
import { ObjRef, objRefToString, Identifier, isObjRef } from "../../objRef";
import { idRef } from "../../objRef/factory";
import SparkMD5 from "spark-md5";

type AttributeBuilderInput = Identifier | ObjRef | IAttribute;

/**
 * Builder for attributes.
 *
 * Do not instantiate this class directly. Instead use {@link newAttribute} or {@link modifyAttribute}.
 *
 * @public
 */
export class AttributeBuilder {
    private attribute: IAttribute["attribute"];
    private customLocalId: boolean = false;

    /**
     * @internal
     */
    constructor(input: AttributeBuilderInput) {
        if (isAttribute(input)) {
            this.attribute = cloneDeep(input.attribute);
            this.customLocalId = true;
        } else {
            const displayForm: ObjRef = isObjRef(input) ? input : idRef(input, "displayForm");

            this.attribute = {
                displayForm,
                localIdentifier: "",
            };
        }
    }

    /**
     * Sets alias - alternative title - for the attribute. This value will then be used in various
     * chart-specific descriptive elements. For convenience if no alias is specified, the attribute
     * will fall back to server-defined value.
     *
     * @param alias - alias to use instead of attribute title; undefined to use server-defined value
     */
    public alias = (alias?: string | undefined) => {
        if (!alias) {
            return this.noAlias();
        }

        this.attribute.alias = alias;

        return this;
    };

    /**
     * Resets alias - alternative title - set for the attribute. The server-defined title of the attribute
     * will be used instead.
     */
    public noAlias = () => {
        delete this.attribute.alias;

        return this;
    };

    /**
     * Sets display form reference.
     *
     * @param ref - new ref to use
     */
    public displayForm = (ref: ObjRef) => {
        this.attribute.displayForm = ref;

        return this;
    };

    /**
     * Sets local identifier (localId) for the attribute. LocalId can be used to reference the attribute
     * within the execution definition.
     *
     * Normally, builder will generate localId based on contents of the attribute definition - taking all
     * properties into account: in typical scenarios you don't have to call this function at all. The only exception
     * where you have to provide custom local id is if your execution must contain the exact same attribute twice.
     *
     * For convenience, this method also accepts 'undefined', which indicates that the default local id generation
     * logic should be used.
     *
     * @param localId - local identifier to set; if not specified, the builder will ensure local id will
     * be generated
     */
    public localId = (localId?: Identifier | undefined) => {
        if (!localId || localId.trim().length === 0) {
            return this.defaultLocalId();
        }

        this.attribute.localIdentifier = localId;
        this.customLocalId = true;

        return this;
    };

    /**
     * Indicates that the attribute's localId should be generated using the default local-id generator logic.
     */
    public defaultLocalId = () => {
        this.attribute.localIdentifier = "";
        this.customLocalId = false;

        return this;
    };

    /**
     * Creates the IAttribute instance.
     */
    public build = () => {
        const localIdentifier = this.getOrGenerateLocalId();

        return {
            attribute: {
                ...this.attribute,
                localIdentifier,
            },
        };
    };

    private getOrGenerateLocalId(): string {
        if (this.customLocalId && !isEmpty(this.attribute.localIdentifier)) {
            return this.attribute.localIdentifier;
        }

        return ["a", this.calculateAliasHash(), objRefToString(this.attribute.displayForm)]
            .filter(part => !isEmpty(part))
            .join("_");
    }

    private calculateAliasHash(): string {
        if (!this.attribute.alias) {
            return "";
        }

        const hasher = new SparkMD5();
        hasher.append(this.attribute.alias);

        return hasher.end().substr(0, 8);
    }
}

/**
 * Function that will be called to perform modifications of an attribute before it is fully constructed.
 *
 * @public
 */
export type AttributeModifications = (builder: AttributeBuilder) => AttributeBuilder;

/**
 * Creates a new attribute with the specified display form ref and optional modifications and localIdentifier.
 * @param displayFormRefOrId - ref or identifier of the attribute display form
 * @param modifications - optional modifications (e.g. alias, etc.)
 * @public
 */
export function newAttribute(
    displayFormRefOrId: ObjRef | Identifier,
    modifications: AttributeModifications = identity,
): IAttribute {
    const builder = new AttributeBuilder(displayFormRefOrId);

    return modifications(builder).build();
}

/**
 * Allows modification of an existing attribute instance.
 *
 * @param attribute - attribute to modify
 * @param modifications - modification function
 * @public
 */
export function modifyAttribute(
    attribute: IAttribute,
    modifications: AttributeModifications = identity,
): IAttribute {
    const builder = new AttributeBuilder(attribute);

    return modifications(builder).build();
}
