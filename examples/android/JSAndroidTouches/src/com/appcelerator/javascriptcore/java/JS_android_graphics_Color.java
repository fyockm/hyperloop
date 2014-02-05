package com.appcelerator.javascriptcore.java;

import android.graphics.Color;

import com.appcelerator.javascriptcore.JavaScriptCoreLibrary;
import com.appcelerator.javascriptcore.enums.JSPropertyAttribute;
import com.appcelerator.javascriptcore.opaquetypes.JSClassDefinition;
import com.appcelerator.javascriptcore.opaquetypes.JSClassRef;
import com.appcelerator.javascriptcore.opaquetypes.JSContextRef;
import com.appcelerator.javascriptcore.opaquetypes.JSObjectRef;
import com.appcelerator.javascriptcore.opaquetypes.JSStaticValues;
import com.appcelerator.javascriptcore.opaquetypes.JSValueRef;
import com.appcelerator.javascriptcore.opaquetypes.Pointer;
import com.appcelerator.javascriptcore.callbacks.JSObjectGetPropertyCallback;

public class JS_android_graphics_Color extends JSClassDefinition {
    
    private static final String[] NAMESPACE = {"android", "graphics"};
    private static final JavaScriptCoreLibrary jsc = JavaScriptCoreLibrary.getInstance();
    private static JSClassRef jsClassRef = null;
    
    private static JSValueRef YELLOW = null;
    private static JSValueRef BLUE = null;
    private static JSValueRef RED = null;
    
    public static boolean registerClass(JSContextRef context, JSObjectRef parentObject) {
        JSValueRef exception = JSValueRef.Null();
        JSObjectRef object = jsc.JSObjectMake(context, getJSClass());
        jsc.JSObjectSetProperty(context, parentObject, getJSClassName(), object, JSPropertyAttribute.DontDelete, exception);

        return jsc.JSValueIsNull(context, exception);
    }
    
    @Override
    public void dispose() {
    	super.dispose();
    	jsClassRef = null;
    	YELLOW = null;
    	BLUE = null;
    	RED = null;
    }

    public static JSClassRef getJSClass() {
        if (jsClassRef == null) {
            JS_android_graphics_Color definition = new JS_android_graphics_Color();
            definition.className   = getJSClassName();
            definition.parentClass = JS_java_lang_Object.getJSClass();
            definition.staticValues    = definition.createStaticValues();
            jsClassRef = jsc.JSClassCreate(definition);
            jsc.JSClassRetain(jsClassRef);
        }
        return jsClassRef;
    }
    
    public static JSObjectRef createJSObject(JSContextRef context, Color mine) {
        return jsc.JSObjectMake(context, getJSClass(), mine);
    }
    
    public static String getJSClassName() {
        return "Color";
    }
    
    public static String[] getNamespace() {
        return NAMESPACE;
    }

    protected JSStaticValues createStaticValues() {
        JSStaticValues values = new JSStaticValues();
        /* Color.RED */
        values.add("RED", new JSObjectGetPropertyCallback() {
            public JSValueRef getProperty(JSContextRef ctx, JSObjectRef object,
                                    String propertyName, Pointer exception) {
            	// Lazy loading
            	if (RED == null) {
                	RED = jsc.JSValueMakeNumber(ctx, Color.RED);
                	jsc.JSValueProtect(ctx, RED);
            	}
                return RED;
            }
        }, null, JSPropertyAttribute.DontDelete);
        
        /* Color.BLUE */
        values.add("BLUE", new JSObjectGetPropertyCallback() {
            public JSValueRef getProperty(JSContextRef ctx, JSObjectRef object,
                                    String propertyName, Pointer exception) {
            	// Lazy loading
            	if (BLUE == null) {
            		BLUE = jsc.JSValueMakeNumber(ctx, Color.BLUE);
                	jsc.JSValueProtect(ctx, BLUE);
            	}
                return BLUE;
            }
        }, null, JSPropertyAttribute.DontDelete);
        
        /* Color.YELLOW */
        values.add("YELLOW", new JSObjectGetPropertyCallback() {
            public JSValueRef getProperty(JSContextRef ctx, JSObjectRef object,
                                    String propertyName, Pointer exception) {
            	// Lazy loading
            	if (YELLOW == null) {
            		YELLOW = jsc.JSValueMakeNumber(ctx, Color.YELLOW);
                	jsc.JSValueProtect(ctx, YELLOW);
            	}
                return YELLOW;
            }
        }, null, JSPropertyAttribute.DontDelete);
        return values;
    }
}
