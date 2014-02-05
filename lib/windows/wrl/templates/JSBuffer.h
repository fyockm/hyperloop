#pragma once
/**
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * This generated code and related technologies are covered by patents
 * or patents pending by Appcelerator, Inc.
 */
#include "hyperloop.h"
#include <string>
#include "JSPrivateObject.h"
#include <JavaScriptCore/JavaScript.h>

typedef enum JSBufferType {
	JSBufferTypePointer, 		// default type
	JSBufferTypeJSValueRef 		// hold a pointer to a JSValueRef
} JSBufferType;

typedef struct JSBuffer {
	void *buffer;
	int length;
	JSBufferType type;
} JSBuffer;

JSObjectRef MakeObjectForJSBuffer(JSContextRef ctx, JSBuffer *instance);
JSObjectRef MakeObjectForJSBufferConstructor(JSContextRef ctx);
void RegisterJSBuffer(JSContextRef ctx, JSObjectRef global);
void DestroyJSBuffer(JSBuffer *buffer);
void SetJSBufferValue(JSContextRef ctx, JSObjectRef object, JSValueRef source);


/**
 * create a JSPrivateObject for storage in a JSObjectRef where the object is a JSBuffer *
 */
JSPrivateObject* HyperloopMakePrivateObjectForJSBuffer(JSBuffer *buffer);

/**
 * return a JSPrivateObject as a JSBuffer (or NULL if not of type JSPrivateObjectTypeJSBuffer)
 */
JSBuffer* HyperloopGetPrivateObjectAsJSBuffer(JSObjectRef object);
